// @ts-ignore
import parse from "@linthtml/html-parser";
import Config from "./config";
import InlineConfig from "./inline_config";
import rules from "../rules";
import { LegacyLinterConfig, LegacyRuleDefinition } from "../read-config";
import { Node, Document } from "@linthtml/dom-utils/lib/dom_elements";
import Issue from "../issue";
import { is_comment_node } from "@linthtml/dom-utils";
import { flatten } from "../utils/array";
/**
 * Apply the raw-ignore-regex option.
 * Return the modified html, and a function that recovers line/column
 * numbers of issues.
 */
function rawIgnoreRegex(html: string, opts: LegacyLinterConfig) {
  const ignore = opts["raw-ignore-regex"];
  if (!ignore) {
    return html;
  }
  return html.replace(new RegExp(ignore as string | RegExp, "gm"), function (match) {
    return match.replace(/[^\n\t\n\r]/g, "¤");
  });
}

export default class Linter {
  public rules: Config;
  public config: LegacyLinterConfig;
  public inlineConfig: InlineConfig;

  constructor(_rules: LegacyRuleDefinition[] | null, ..._config: LegacyLinterConfig[]) {
    const config = _config.reduce(
      (obj, cell) => ({
        ...obj,
        ...cell
      }),
      {}
    );
    delete config.ignoreFiles;
    this.config = config;
    _rules = _rules || rules;
    this.rules = new Config(_rules);
    this.inlineConfig = new InlineConfig(this.rules);
  }

  use(plugin: { rules: LegacyRuleDefinition[] }) {
    if (plugin.rules) {
      plugin.rules.forEach((rule: LegacyRuleDefinition) => this.rules.addRule(rule));
    }
  }

  /**
   * Lints the HTML with the options supplied in the environments setup.
   * @param {String} html - the html as a string to lint.
   * @returns {import('../issue')[]}
   */
  lint(html: string) {
    let issues: Issue[] = [];
    this.inlineConfig = new InlineConfig(this.rules);
    this.rules.initOptions(this.config);
    html = rawIgnoreRegex(html, this.config);

    const dom = parse(html);
    issues = issues.concat(this.setupInlineConfigs(dom));

    try {
      issues = issues.concat(this.lintDom(dom, this.config));
    } finally {
      issues = issues.concat(this.resetRules(this.config));
    }

    if (this.config.maxerr) {
      issues = issues.slice(0, this.config.maxerr);
    }

    return Promise.resolve(issues);
  }

  // Here ignore ts error as "dom" is special rule.
  lintDom(dom: Document, opts: unknown): Issue[] {
    // @ts-ignore
    return this.rules.getRule("dom").lint(dom, opts, this.inlineConfig);
  }

  resetRules(opts?: unknown) {
    const rules = this.rules.getAllRules().map((rule) => {
      const r = rule.end && rule.end(opts);
      return r || [];
    });
    return flatten(rules);
  }

  setupInlineConfigs(dom: Document): Issue[] {
    let issues: Issue[] = [];
    const { inlineConfig } = this;
    function feedComments(element: Node) {
      if (is_comment_node(element)) {
        issues = issues.concat(inlineConfig.feedComment(element));
      }
      if (element.children) {
        element.children.map(feedComments);
      }
    }
    dom.children.forEach(feedComments.bind(this));
    return issues;
  }
}
