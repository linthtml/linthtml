const { is_tag_node, has_non_empty_attribute } = require("../../knife/tag_utils");

const RULE_NAME = "img-req-src";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || node.name !== "img") {
    return;
  }
  if (has_non_empty_attribute(node, "src") === false) {
    report({
      code: "E014",
      position: node.open.loc
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
