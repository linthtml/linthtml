function Issue(code, position, rule_name, options = {}) {
  this.line = position[0];
  this.column = position[1];
  this.code = code;
  this.rule = rule_name;
  this.data = options.data || {};
  this.severity = options.severity || "error";
}
module.exports = Issue;
