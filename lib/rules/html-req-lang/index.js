const { is_tag_node, has_non_empty_attribute } = require("../../knife/tag_utils");

const RULE_NAME = "html-req-lang";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || node.name !== "html") {
    return;
  }
  if (has_non_empty_attribute(node, "lang") === false) {
    report({
      code: "E025",
      position: node.open.loc
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
