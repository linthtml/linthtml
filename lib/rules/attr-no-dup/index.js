const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "attr-no-dup";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
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
}

module.exports = {
  name: RULE_NAME,
  lint
};
