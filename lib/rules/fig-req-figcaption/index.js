const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "fig-req-figcaption";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false) {
    return;
  }
  if (node.name === "figure") {
    // get the children of this figure
    const children = node.children;
    const has_caption = children.find(child => child.name === "figcaption");
    if (has_caption === undefined) {
      report({
        code: "E032",
        position: node.open.loc
      });
    }
  }
  if (node.name === "figcaption") {
    if (!node.parent || node.parent.name !== "figure") {
      report({
        code: "E032",
        position: node.open.loc
      });
    }
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
