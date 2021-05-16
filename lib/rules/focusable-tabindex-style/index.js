const { is_tag_node } = require("../../knife/tag_utils");
const { has_attribute, has_non_empty_attribute, attribute_value } = require("../../knife");

const RULE_NAME = "focusable-tabindex-style";

function isLinkable(node) {
  const isLink = ["a", "area"].indexOf(node.name) !== -1;
  return isLink ? has_attribute(node, "href") : false;
}

function isFocusableNode(node) {
  const isFocusableNatively =
    ["button", "input", "select", "textarea"].indexOf(node.name) !== -1;

  return (
    isFocusableNatively || isLinkable(node) || has_non_empty_attribute(node, "tabindex")
  );
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (
    is_tag_node(node) === false ||
    isFocusableNode(node) === false
  ) {
    return;
  }
  if (has_attribute(node, "disabled") === false) {
    const tabindex = attribute_value(node, "tabindex");
    if (tabindex && parseInt(tabindex.chars, 10) > 0) {
      report({
        code: "E026",
        position: node.open.loc,
        meta: {
          data: {
            tabindex: parseInt(tabindex.chars, 10)
          }
        }
      });
    }
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
