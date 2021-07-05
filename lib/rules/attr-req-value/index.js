const { is_boolean_attribute } = require("../../knife");
const { is_tag_node, has_non_empty_attribute } = require("../../knife/tag_utils");

const RULE_NAME = "attr-req-value";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false) {
    return;
  }
  // TODO: Remove after `raw-ignore-text` refacto
  const attributes = node.attributes.filter(({ name }) => /^¤+$/.test(name.chars) === false);
  attributes.forEach(attribute => {
    const name = attribute.name.chars.toLowerCase();

    if (!has_non_empty_attribute(node, name) && !is_boolean_attribute(name)) {
      report({
        code: "E006",
        position: attribute.loc,
        meta: {
          data: {
            attribute: name
          }
        }
      });
    }
  });
}

module.exports = {
  name: RULE_NAME,
  lint
};
