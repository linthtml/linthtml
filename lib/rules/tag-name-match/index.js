const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "tag-name-match";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false) {
    return;
  }
  const { name, open, close } = node;
  // If the tag did not close itself
  // remove toLowerCase
  if (!close || name.toLowerCase() !== close.chars.toLowerCase()) {
    return;
  }

  if (open.chars !== close.chars) {
    report({
      code: "E030",
      position: node.close.loc,
      meta: {
        data: {
          open
        }
      }
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
