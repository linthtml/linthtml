import Issue from "../issue.js";
import type { Document, Node } from "@linthtml/dom-utils/dom_elements";
import type { InlineConfigIndex } from "../legacy/inline_config.js";
import type InlineConfig from "../legacy/inline_config.js";
import type { LegacyLinterConfig, RuleDefinition } from "../read-config.js";

function apply_rules(rules: RuleDefinition[], element: Node, global_config: LegacyLinterConfig) {
  const issues: Issue[] = [];
  if (!rules) {
    return [];
  }
  function report(rule: RuleDefinition) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data: any) => {
      if (Array.isArray(data)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        issues.push(...data);
      } else {
        /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
        const meta = {
          ...data.meta,
          code: data.code,
          message: data.message
        };
        /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        issues.push(new Issue(rule.name, data.position, meta));
      }
    };
  }
  const activated_rules = rules.reduce((rules, rule) => {
    return {
      ...rules,
      [rule.name]: rule
    };
  }, {});
  rules.forEach((rule) => {
    const rule_config = global_config[rule.name];
    rule.lint(element, rule_config, {
      report: report(rule),
      rules: activated_rules,
      global_config
    });
  });
  return issues;
}

function lint(dom: Document, opts: InlineConfigIndex, inlineConfigs: InlineConfig) {
  // @ts-expect-error Legacy, rules should not have a context object normally
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const subs = this.subscribers;
  /*
   * Reset our inline configuration object to be what opts is.
   * Does a deep copy so as to not change opts in the future.
   */
  inlineConfigs.reset(opts);

  const getIssues = function (element: Node) {
    // fast-forwards inlineConfig.current to whatever it should be at this index.
    inlineConfigs.getOptsAtIndex(element.startIndex as number);

    let issues = apply_rules(subs as RuleDefinition[], element, inlineConfigs.current);

    if (element.children && element.children.length > 0) {
      element.children.forEach(function (child) {
        issues = issues.concat(getIssues(child));
      });
    }
    return issues;
  };

  const issues = dom.children.length ? dom.children.map(getIssues) : [];
  return issues.flat();
}

export default {
  name: "dom",
  lint
};
