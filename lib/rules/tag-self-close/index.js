const { is_void_node } = require("../../knife");
const { is_tag_node, is_self_closing } = require("../../knife/tag_utils");
const { create_list_value_validator } = require("../../validate_option");

const RULE_NAME = "tag-self-close";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} style
 * @param {*} param2
 */
function lint(node, style, { report }) {
  if (is_tag_node(node) === false || is_void_node(node) === false) {
    return;
  }
  const { name, close } = node;
  // If the tag did not close itself
  // remove toLowerCase
  if (!close || name.toLowerCase() !== close.chars.toLowerCase()) {
    const selfClose = is_self_closing(node);
    if (
      (style === "always" && !selfClose) ||
      (style === "never" && selfClose)
    ) {
      report({
        code: "E018",
        position: node.open.loc,
        meta: {
          data: {
            expect: style
          }
        }
      });
    }
  }
}

module.exports = {
  name: RULE_NAME,
  validateConfig: create_list_value_validator(["always", "never"], false),
  lint
};
