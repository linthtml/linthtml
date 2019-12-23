const knife = require("../../knife");

module.exports = {
  name: "id-class-no-ad",
  on: ["tag"],
  need: "tag"
};

module.exports.lint = function(node, opts, { report }) {
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
