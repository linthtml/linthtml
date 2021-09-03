const { flatten } = require("../utils/arrays");

const Issue = require("../issue");

function apply_rules(rules, element, global_config) {
  const issues = [];
  if (!rules) {
    return [];
  }
  function report(rule) {
    return (data) => {
      if (Array.isArray(data)) {
        issues.push(...data);
      } else {
        const meta = {
          ...data.meta,
          code: data.code,
          message: data.message
        };

        issues.push(new Issue(
          rule.name,
          data.position,
          meta
        ));
      }
    };
  }
  const activated_rules = rules.reduce((rules, rule) => {
    return {
      ...rules,
      [rule.name]: rule
    };
  }, {});
  rules.forEach(rule => {
    const rule_config = global_config[rule.name];
    rule.lint(element, rule_config, { report: report(rule), rules: activated_rules, global_config });
  });
  return issues;
}

function lint(dom, opts, inlineConfigs) {
  const subs = this.subscribers;
  /*
   * Reset our inline configuration object to be what opts is.
   * Does a deep copy so as to not change opts in the future.
   */
  inlineConfigs.reset(opts);

  const getIssues = function(element) {
    // fast-forwards inlineConfig.current to whatever it should be at this index.
    inlineConfigs.getOptsAtIndex(element.startIndex);

    let issues = apply_rules(subs, element, inlineConfigs.current);

    if (element.children && element.children.length > 0) {
      element.children.forEach(function(child) {
        issues = issues.concat(getIssues(child));
      });
    }
    return issues;
  };

  const issues = dom.children.length
    ? dom.children.map(getIssues)
    : [];
  return flatten(issues);
}

module.exports = {
  name: "dom",
  lint
};
