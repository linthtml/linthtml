const { is_tag_node, attribute_has_value } = require("../../knife/tag_utils");

const RULE_NAME = "link-req-noopener";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || node.name !== "a") {
    return;
  }

  const noopen = /(^| )(noopener|noreferrer)( |$)/;

  if (attribute_has_value(node, "target", "_blank") && attribute_has_value(node, "rel", noopen) === false) {
    report({
      code: "E058",
      position: node.open.loc
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};

// <base target="_blank" />
// https://html.com/attributes/base-target/
