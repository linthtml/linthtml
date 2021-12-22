class ConstRule {
  constructor(issues) {
    this.issues = issues;
    this.name = "dom"; // Override normal dom rule
    this.description = "returns a constant issue array for all inputs";
  }
  lint() {
    return this.issues
  }
}

module.exports = ConstRule;
