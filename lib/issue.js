/**
 * A lint issue
 * @property {import('./parser/index').Position} position - Location of the issue
 * @property {String} code
 * @property {String} rule
 * @property {Object} data
 * @property {('error'|'warning')} severity
 */
class Issue {
  /**
   * @constructor
   * @param {String} code
   * @param {import('./parser/index').Position} position
   * @param {String} rule_name
   * @param {Object} options
   */
  constructor(code, position, rule_name, options = {}) {
    this.position = position;
    this.code = code;
    this.rule = rule_name;
    this.data = options.data || {};
    this.severity = options.severity || "error";
  }
}
module.exports = Issue;
