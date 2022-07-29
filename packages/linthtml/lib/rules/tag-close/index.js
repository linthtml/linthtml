const { is_void_node } = require("@linthtml/dom-utils");
// TODO: Find a way to get rid of `dist/lib`
const { is_tag_node } = require("@linthtml/dom-utils/dist/lib/tags");

const RULE_NAME = "tag-close";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || is_void_node(node)) {
    return;
  }
  const { name, close } = node;
  // If the tag did not close itself
  // remove toLowerCase
  if (!close || name.toLowerCase() !== close.chars.toLowerCase()) {
    report({
      code: "E042",
      position: node.open.loc
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
