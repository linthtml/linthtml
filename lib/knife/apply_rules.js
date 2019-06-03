const { flatten } = require('../utils/arrays');


function addRuleToIssue(issue, ruleName) {
  if (Array.isArray(issue)) {
    issue.forEach(function(issue) {
      addRuleToIssue(issue, ruleName);
    });
  } else {
    issue.rule = issue.rule || ruleName;
  }
}

module.exports = function(rules, element, opts) {
  if (!rules) {
    return [];
  }

  rules = rules.map(rule => {
    var issues = rule.lint.call(rule, element, opts);

    addRuleToIssue(issues, rule.name);

    return issues;
  });
  return flatten(rules);
};

