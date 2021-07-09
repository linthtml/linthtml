const { has_non_empty_attribute } = require("../../knife");
const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "button-req-content";

function has_text_content(node) {
  let result = false;
  if (node.type === "comment") {
    return result;
  }
  if (node.type === "text") {
    return node.data.trim().length > 0;
  }
  for (let i = 0; i < node.children.length; i++) {
    result = has_text_content(node.children[i]);
    if (result === true) {
      break;
    }
  }
  return result;
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || node.name !== "button") {
    return;
  }
  if (has_text_content(node) === false && has_non_empty_attribute(node, "aria-label") === false) {
    report({
      code: "E061",
      position: node.open.loc
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
