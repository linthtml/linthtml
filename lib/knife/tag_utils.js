const { types: { isRegExp } } = require("util");

/**
 * @typedef {import('../parser/index').Node} Node
 * @typedef {import('../parser/index').CharValue} CharValue
 * @typedef {import('../parser/index').NodeAttribute} NodeAttribute
 */

/**
 * @param {Node} node
 * @returns {boolean}
 */
function is_self_closing(node) {
  const openRaw = node.open.raw;
  return /\/>$/.test(openRaw);
}

/**
 * Check whether the given tag has a non-empty attribute with the given
 * name. Count "" as a non-empty attribute value only if optional
 * parameter allowNull is true
 *
 * @param {Node} node
 * @param {string} attribute_name
 * @param {boolean} [allowNull=false]
 * @returns {boolean}
 */
function has_non_empty_attribute(node, attribute_name, allowNull = false) {
  const attribute = node.attributes.find(({ name }) => name.chars.toLowerCase() === attribute_name);
  return !!attribute && (allowNull || (!!attribute.value && attribute.value.chars.length > 0));
}

/**
 * @param {Node} node
 * @param {string} attribute_name
 * @returns {boolean}
 */
function has_attribute(node, attribute_name) {
  return is_tag_node(node)
    ? node.attributes.some(({ name }) => name.chars.toLowerCase() === attribute_name)
    : false;
}

/**
 * @param {Node} node
 * @param {string} attribute_name
 * @returns {CharValue | null}
 */
function attribute_value(node, attribute_name) {
  if (has_non_empty_attribute(node, attribute_name)) {
    return node.attributes
      .find(({ name }) => name.chars.toLowerCase() === attribute_name)
      .value;
  }
  return null;
}

/**
 * @param {Node} node
 * @param {string} attribute_name
 * @returns {NodeAttribute}
 */
function get_attribute(node, attribute_name) {
  if (has_attribute(node, attribute_name)) {
    return node.attributes
      .find(({ name }) => name.chars.toLowerCase() === attribute_name);
  }
  return null;
}

/**
 * @param {Node} node
 * @param {string} attribute_name
 * @param {string | RegExp} value_to_check
 * @returns {boolean}
 */
function attribute_has_value(node, attribute_name, value_to_check) {
  const value = attribute_value(node, attribute_name);
  if (value) {
    return isRegExp(value_to_check)
      ? value_to_check.test(value.chars)
      : value.chars === value_to_check;
  }
  return false;
}

/**
 * @param {Node} node
 * @returns {boolean}
 */
function is_tag_node(node) {
  return ["tag", "style", "script"].indexOf(node.type) !== -1;
}

/**
 * @param {Node} node
 * @returns {boolean}
 */
function is_text_node(node) {
  return node.type === "text";
}

/**
 * @param {NodeAttribute} node
 * @returns {string}
 */
function get_classes(class_attribute) {
  const classes = class_attribute ? class_attribute.chars : "";
  return classes
    .trim()
    .split(/\s+/);
}

/**
 * @param {Node} node
 * @returns {string} name of the tag
 */
function node_tag_name(node) {
  switch (node.type) {
    case "text":
      return "Text Node"; // get text node content but truncate ?
    case "comment":
      return "Comment";
    default:
      return node.name;
  }
}

/**
 * @param {Node} node
 * @returns {Boolean}
 */
function has_parent_node(node) {
  // root node is not a "normal" node
  return Boolean(node.parent) && node.parent.type !== "root";
}

module.exports = {
  has_non_empty_attribute,
  attribute_value,
  is_tag_node,
  is_text_node,
  is_self_closing,
  get_attribute,
  has_attribute,
  attribute_has_value,
  get_classes,
  node_tag_name,
  has_parent_node
};
