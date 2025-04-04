import Config from "./config.js";
import type { InlineConfig } from "./inline_config.js";
import { extract_inline_config } from "./inline_config.js";
import rules from "./rules/index.js";
import Issue, { ISSUE_SEVERITY } from "./issue.js";
import CustomError from "./utils/custom-errors.js";

import type { ActiveRuleDefinition, LegacyLinterConfig, LinterConfig } from "./read-config.js";
import { get_module_path } from "./read-config.js";
import type { Range, Document, Node } from "@linthtml/dom-utils/dom_elements";

type Parser = Promise<(html: string) => Document>;

/**
 * Apply the raw-ignore-regex option.
 * Return the modified html, and a function that recovers line/column
 * numbers of issues.
 */
function raw_ignore_regex(html: string, options: LegacyLinterConfig | LinterConfig): string {
  const ignore = options["raw-ignore-regex"];
  if (!ignore) {
    return html;
  }
  // TODO: Remove `as ...` after adding validation to `x-regex` property in config files
  return html.replace(new RegExp(ignore, "gm"), function (match) {
    return match.replace(/[^\n\t\n\r]/g, "¤");
  });
}

function merge_inline_config(base_config: InlineConfig, new_config: InlineConfig): InlineConfig {
  const merged_config: InlineConfig = Object.keys(new_config).reduce((merged_config, rule_name) => {
    if (base_config[rule_name]) {
      merged_config[rule_name] = {
        ...base_config[rule_name],
        ...new_config[rule_name]
      };
    } else {
      merged_config[rule_name] = new_config[rule_name];
    }
    return merged_config;
  }, {} as InlineConfig);
  return {
    ...base_config,
    ...merged_config
  };
}

function get_parser(config: LinterConfig): Parser {
  if (config?.parser) {
    try {
      const parser_module = get_module_path(process.cwd(), config.parser);
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access
      return import(parser_module).then((parser) => (parser.default ?? parser) as Parser);
    } catch (error) {
      // @ts-expect-error system error with meta object
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      throw new CustomError("CORE-04", { module_name: error.meta.module_name });
    }
  }
  // Eslint Typescript recommend using import statement but import return a promise.
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  return import("@linthtml/html-parser").then((parser) => parser.default ?? parser);
}

export default class Linter {
  private get_parse_fn: () => Parser;

  public config: Config;

  constructor(config: LinterConfig) {
    this.get_parse_fn = () => get_parser(config);
    // this.parse_fn = get_parser(config);
    this.config = new Config(rules, config);
  }

  /**
   * Lints the HTML with the options supplied in the environments setup.
   */
  async lint(html: string): Promise<Issue[]> {
    html = raw_ignore_regex(html, this.config.config);
    const parse_fn = await this.get_parse_fn();
    const dom = parse_fn(html);
    const activated_rules: ActiveRuleDefinition[] = Object.keys(this.config.activated_rules).map(
      (name) => this.config.activated_rules[name]
    );
    const rules_deprecated_issues = this.report_deprecated_rules(activated_rules);
    const dom_issues = this.lint_DOM(activated_rules, dom);
    let issues: Issue[] = [...rules_deprecated_issues, ...dom_issues, ...this.reset_rules()];

    if (this.config.config.maxerr) {
      issues = issues.slice(0, this.config.config.maxerr); // REMOVE: After v1.
    }

    return Promise.resolve(issues);
  }

  private report_deprecated_rules(activated_rules: ActiveRuleDefinition[]): Issue[] {
    return activated_rules
      .filter(({ deprecated }) => deprecated)
      .map(
        (rule) =>
          new Issue("", null, {
            code: "DEPRECATED_RULE",
            severity: ISSUE_SEVERITY.WARNING,
            data: {
              rule_name: rule.name,
              hint: rule.deprecation_hint
            }
          })
      );
  }

  private lint_DOM(rules: ActiveRuleDefinition[], dom: Document): Issue[] {
    const issues: Issue[] = [];
    // merge with report in call_rule_lint ?
    function report_inline_config(data: { code: string; position: Range; meta?: Record<string, unknown> }) {
      const meta = {
        ...data.meta,
        severity: "error",
        code: data.code
      } as const;

      issues.push(new Issue("inline_config", data.position, meta));
    }

    const getIssues = (node: Node, parent_inline_config: InlineConfig): Issue[] => {
      let issues = rules.reduce(
        (issues, rule) => [...issues, ...this.call_rule_lint(rule, node, parent_inline_config)],
        [] as Issue[]
      );
      if (node.children && node.children.length > 0) {
        let inline_config = {
          ...parent_inline_config
        };
        node.children.forEach((child: Node) => {
          const extracted_inline_config = extract_inline_config(child, this.config, report_inline_config);
          inline_config = merge_inline_config(inline_config, extracted_inline_config);
          issues = [...issues, ...getIssues(child, inline_config)];
        });
      }
      return issues;
    };

    let inline_config: InlineConfig = {};
    const rules_issues: Issue[][] = dom.children.map((node: Node) => {
      const extracted_inline_config = extract_inline_config(node, this.config, report_inline_config);
      inline_config = merge_inline_config(inline_config, extracted_inline_config);
      return getIssues(node, inline_config);
    });
    return [...issues, ...rules_issues.flat()];
  }

  // TODO: Remove after v1
  private call_rule_lint(rule: ActiveRuleDefinition, node: Node, inline_config: InlineConfig): Issue[] {
    const issues: Issue[] = [];
    function report(data: { code: string; position: Range; meta?: Record<string, unknown>; message?: string }) {
      const meta = {
        ...data.meta,
        severity: rule.severity,
        code: data.code,
        message: data.message
      } as const;

      issues.push(new Issue(rule.name, data.position, meta));
    }
    if (inline_config[rule.name]?.disabled === true) {
      // inline_config[rule.name]?.disabled
      return issues;
    }

    const rule_config = inline_config[rule.name]?.config ?? this.config.legacy_config[rule.name];

    const global_config = inline_config[rule.name]?.config
      ? {
          ...this.config.legacy_config,
          [rule.name]: inline_config[rule.name].config
        }
      : this.config.legacy_config;

    rule.lint(node, rule_config, {
      report,
      rules: this.config.activated_rules,
      global_config
    });
    return issues;
  }

  private reset_rules(): Issue[] {
    const activated_rules = Object.keys(this.config.activated_rules);
    return activated_rules.reduce((issues, name) => {
      const rule = this.config.getRule(name);
      const r = rule.end?.() ?? [];
      return [...issues, ...r];
    }, [] as Issue[]);
  }
}
