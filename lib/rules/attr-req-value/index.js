var knife = require("../../knife"),
  Issue = require("../../issue");

module.exports = {
  name: "attr-req-value",
  on: ["attr"]
};

module.exports.lint = function(attr/*, opts*/) {
  var raw = attr.rawEqValue;

  if (raw ? /^=[^'"]+/.test(raw) : !knife.isBooleanAttr(attr.name)) {
    return new Issue("E006", attr.valueLineCol);
  }

  return [];
};
