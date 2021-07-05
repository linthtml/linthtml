/**
 * A lint issue
 * @property {import('./parser/index').Position} position - Location of the issue
 * @property {String} code
 * @property {String} rule
 * @property {Object} data
 * @property {String} message
 * @property {('error'|'warning')} severity
 */
class Issue {
  /**
   * @constructor
   * @param {String} rule_name
   * @param {import('./parser/index').Position} position
   * @param {Object} options
   */
  constructor(rule_name, position, options = {}) {
    this.position = position;
    this.code = options.code;
    this.rule = rule_name;
    this.message = options.message;
    this.data = options.data || {};
    this.severity = options.severity || "error";
  }
}
module.exports = Issue;
