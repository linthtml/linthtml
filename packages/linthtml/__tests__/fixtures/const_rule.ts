export default class ConstRule {
  public issues: any[];
  public name = "dom";
  public description = "returns a constant issue array for all inputs";

  constructor(issues: any[]) {
    this.issues = issues;
  }
  lint() {
    return this.issues;
  }
}
