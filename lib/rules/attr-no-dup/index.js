const { is_tag_node } = require("../../knife/tag_utils");

module.exports = {
  name: "attr-no-dup",
  on: "dom"
};

module.exports.lint = function(node, opts, { report }) {
  if (is_tag_node(node) === false) {
    return;
  }

  const attributes_map = new Map();
  node.attributes.forEach(attribute => {
    const name = attribute.name.chars.toLowerCase();
    if (attributes_map.has(name)) {
      report({
        code: "E003",
        position: attributes_map.get(name).loc,
        meta: {
          data: {
            attribute: name
          }
        }
      });
    } else {
      attributes_map.set(name, attribute);
    }
  });
};
