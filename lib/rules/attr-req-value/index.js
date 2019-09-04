var knife = require("../../knife"),
  Issue = require("../../issue");

module.exports = {
  name: "attr-req-value",
  on: ["tag"],
  need: "tag"
};

module.exports.lint = function(node) {
  let issues = [];
  let attributes = Object.values(node.attribs);
  // TODO: Remove after `raw-ignore-text` refacto
  attributes = attributes.filter(attribute => /^¤+$/.test(attribute.rawName) === false);

  attributes.forEach(attribute => {
    const raw = attribute.rawEqValue;
    if (raw ? /^=[^'"]+/.test(raw) : !knife.isBooleanAttr(attribute.rawName)) {
      issues.push(new Issue("E006", attribute.valueLineCol));
    }
  });

  return issues;
};
