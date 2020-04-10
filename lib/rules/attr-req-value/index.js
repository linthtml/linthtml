const knife = require("../../knife");
const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "attr-req-value",
  on: ["dom"],
  need: "dom"
};

module.exports.lint = function(node, opts, { report }) {
  if (isTagNode(node) === false) {
    return;
  }

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
