function Issue(code, position, rule_name, options = {}) {
  this.position = position;
  this.code = code;
  this.rule = rule_name;
  this.data = options.data || {};
  this.severity = options.severity || "error";
}
module.exports = Issue;
