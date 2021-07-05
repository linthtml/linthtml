const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "head-req-title";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
// TODO: Should return an error if title does not have a text node has a child
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || node.name !== "head") {
    return;
  }
  const titles = node.children.filter(child => child.name === "title");
  const has_title_with_children = titles.some((title) => {
    return title.children.length > 0;
  });

  if (has_title_with_children === false) {
    report({
      code: "E027",
      position: node.open.loc
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
