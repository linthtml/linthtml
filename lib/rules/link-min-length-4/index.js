const { is_tag_node, attribute_value, has_non_empty_attribute } = require("../../knife/tag_utils");

const RULE_NAME = "link-min-length-4";

function get_text_content(node) {
  if (node.type === "comment") {
    return "";
  }
  if (node.type === "text") {
    return node.data;
  }
  return node.children.reduce((content, child) => `${content}${get_text_content(child)}`, "");
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || node.name !== "a") {
    return;
  }
  // Will add a rule to enforce href attribute on link
  if (has_non_empty_attribute(node, "href") === false) {
    return [];
  }
  const content = get_text_content(node).trim();
  let aria_label = attribute_value(node, "aria-label");
  aria_label = aria_label
    ? aria_label.chars
    : "";

  // TODO: need to deal with aria-labelledby
  if (content.length < 4 && aria_label.length < 4) {
    report({
      code: "E059",
      position: node.open.loc,
      meta: {
        data: {
          content
        }
      }
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
