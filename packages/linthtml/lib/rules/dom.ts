import Issue from "../issue";
import { Document, Node } from "@linthtml/dom-utils/lib/dom_elements";
import InlineConfig, { InlineConfigIndex } from "../legacy/inline_config";
import { LegacyLinterConfig, RuleDefinition } from "../read-config";
import { flatten } from "../utils/array";

// TODO: remove .default after typescript migration

function apply_rules(rules: RuleDefinition[], element: Node, global_config: LegacyLinterConfig) {
  const issues: Issue[] = [];
  if (!rules) {
    return [];
  }
  function report(rule: RuleDefinition) {
    return (data: any) => {
      if (Array.isArray(data)) {
        issues.push(...data);
      } else {
        const meta = {
          ...data.meta,
          code: data.code,
          message: data.message
        };

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
  // @ts-ignore
  const subs = this.subscribers;
  /*
   * Reset our inline configuration object to be what opts is.
   * Does a deep copy so as to not change opts in the future.
   */
  inlineConfigs.reset(opts);

  const getIssues = function (element: Node) {
    // fast-forwards inlineConfig.current to whatever it should be at this index.
    inlineConfigs.getOptsAtIndex(element.startIndex as number);

    let issues = apply_rules(subs, element, inlineConfigs.current);

    if (element.children && element.children.length > 0) {
      element.children.forEach(function (child) {
        issues = issues.concat(getIssues(child));
      });
    }
    return issues;
  };

  const issues = dom.children.length ? dom.children.map(getIssues) : [];
  return flatten(issues);
}

export default {
  name: "dom",
  lint
};
