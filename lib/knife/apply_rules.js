const Issue = require("../issue");

module.exports = function(rules, element, opts) {
  const issues = [];
  if (!rules) {
    return [];
  }
  function report(rule) {
    return (data) => {
      if (Array.isArray(data)) {
        issues.push(...data);
      } else {
        issues.push(new Issue(
          data.code,
          data.position,
          rule.name,
          data.meta
        ));
      }
    };
  }
  let activated_rules = null;
  rules.forEach(rule => {
    activated_rules = activated_rules || {};
    activated_rules[rule.name] = rule;
  });
  rules = rules.forEach(rule => {
    rule.lint(element, opts, { report: report(rule), rules: activated_rules });
  });
  return issues;
};
