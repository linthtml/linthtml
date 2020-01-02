const knife = require("../../knife");

module.exports = {
  name: "attr-req-value",
  on: ["tag"],
  need: "tag"
};

module.exports.lint = function(node, opts, { report }) {
  let attributes = Object.values(node.attribs);
  // TODO: Remove after `raw-ignore-text` refacto
  attributes = attributes.filter(attribute => /^¤+$/.test(attribute.rawName) === false);

  attributes.forEach(attribute => {
    const raw = attribute.rawEqValue;
    if (raw ? /^=[^'"]+/.test(raw) : !knife.isBooleanAttr(attribute.rawName)) {
      report({
        code: "E006",
        position: attribute.valueLineCol
      });
    }
  });
};
