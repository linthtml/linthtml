const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "table-req-caption";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || node.name !== "table") {
    return;
  }
  const has_caption = node.children.some(function(c) {
    return c.name === "caption";
  });
  if (has_caption === false) {
    report({
      code: "E031",
      position: node.open.loc
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
