const { is_tag_node, has_attribute, attribute_value, get_attribute } = require("../../knife/tag_utils");
const { create_list_value_validator } = require("../../validate_option");

const RULE_NAME = "href-style";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} format
 * @param {*} param2
 */
function lint(node, format, { report }) {
  if (is_tag_node(node) === false || node.name !== "a") {
    return;
  }

  // TODO: Should return an issue, since a without href is bad
  if (has_attribute(node, "href") === false) {
    return [];
  }

  const href_value = attribute_value(node, "href").chars;

  // TODO: Remove after `raw-ignore-text` refacto
  if (/^¤+$/.test(href_value)) {
    return [];
  }

  // Allow fragment-only URLs
  const is_fragment = href_value.startsWith("#");
  // Link must be absolute if specified format is absolute
  const is_absolute = href_value.search("://") !== -1;
  const match_format = is_absolute === (format === "absolute");
  if (is_fragment === false && match_format === false) {
    const attribute = get_attribute(node, "href");
    report({
      code: "E009",
      position: attribute.loc,
      meta: {
        data: {
          format: format
        }
      }
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint,
  validateConfig: create_list_value_validator(["absolute", "relative"], false)
};
