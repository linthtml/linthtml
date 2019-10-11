const Issue = require("../issue");

module.exports = function(rules, element, opts) {
  let issues = [];
  if (!rules) {
    return [];
  }
  function report(data) {
    if (Array.isArray(data)) {
      issues.push(...data);
    } else {
      issues.push(new Issue(
        data.code,
        data.position,
        data.meta
      ));
    }
  }
  rules = rules.forEach(rule => {
    rule.lint(element, opts, {report});
  });
  return issues;
};

