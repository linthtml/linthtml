const { is_tag_node } = require("../../knife/tag_utils");

module.exports = {
  name: "id-class-no-ad",
  on: "dom"
};

module.exports.lint = function(node, opts, { report }) {
  if (is_tag_node(node) === false) {
    return;
  }
  // TODO: Remove after `raw-ignore-text` refacto
  let attributes = node.attributes.filter(({ name }) => /^¤+$/.test(name.chars) === false);
  attributes = attributes.filter(({ name, value }) => ["id", "class"].indexOf(name.chars) !== -1 && value !== null);

  attributes.forEach(attribute => {
    const regex = /(^|[^a-zA-Z0-9])(ad|banner|social)(?![a-zA-Z0-9])/;
    const match = regex.exec(attribute.value.chars);
    if (match) {
      report({
        code: "E010",
        position: attribute.loc,
        meta: {
          data: {
            word: match[2],
            attribute: attribute.name.chars
          }
        }
      });
    }
  });
};
