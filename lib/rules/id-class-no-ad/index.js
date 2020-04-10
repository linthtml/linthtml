const { isTagNode } = require("../../knife/tag_utils");
const knife = require("../../knife");

module.exports = {
  name: "id-class-no-ad",
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
  attributes = attributes.filter(attribute => attribute.rawName === "id" || attribute.rawName === "class");

  attributes.forEach(attribute => {
    const regex = /(^|[^a-zA-Z0-9])(ad|banner|social)(?![a-zA-Z0-9])/;
    const match = regex.exec(attribute.value);
    if (match) {
      const index = match.index + match[1].length;
      const lc = knife.getLineColFunc(attribute.value, attribute.valueLineCol)(index);
      report({
        code: "E010",
        position: lc,
        meta: {
          data: {
            word: match[2]
          }
        }
      });
    }
  });
};
