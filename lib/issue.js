function Issue(code, pos, rule_name, data = {}) {
  this.line = pos[0];
  this.column = pos[1];
  this.code = code;
  this.rule = rule_name;
  this.data = data.data;
}
module.exports = Issue;
