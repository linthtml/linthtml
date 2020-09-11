const ConstRule = function(issues) {
  this.issues = issues;
  this.name = "dom"; // Override normal dom rule
  this.description = "returns a constant issue array for all inputs";
};

ConstRule.prototype.lint = function() {
  return this.issues;
};

module.exports = ConstRule;
