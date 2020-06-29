const { isRegExp } = require("util");

/**
 *
 *
 * @param {*} element
 * @returns
 */
function is_self_closing(node) {
  const openRaw = node.open.raw;
  return /\/>$/.test(openRaw);
}

// Check whether the given tag has a non-empty attribute with the given
// name. Count "" as a non-empty attribute value only if optional
// parameter allowNull is true,
function has_non_empty_attribute(node, attribute_name, allowNull) {
  const attribute = node.attributes.find(({ name }) => name.chars.toLowerCase() === attribute_name);
  return !!attribute && (allowNull || (!!attribute.value && attribute.value.chars.length > 0));
}

/**
 *
 *
 * @param {*} node
 * @param {*} attribute_name
 * @returns
 */
function has_attribute(node, attribute_name) {
  return is_tag_node(node)
    ? node.attributes.some(({ name }) => name.chars.toLowerCase() === attribute_name)
    : false;
}
/**
 *
 *
 * @param {*} node
 * @param {*} attribute_name
 * @returns
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
 *
 *
 * @param {*} node
 * @param {*} attribute_name
 * @returns
 */
function get_attribute(node, attribute_name) {
  if (has_non_empty_attribute(node, attribute_name)) {
    return node.attributes
      .find(({ name }) => name.chars.toLowerCase() === attribute_name);
  }
  return null;
}

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
 *
 *
 * @param {*} node
 * @returns
 */
function is_tag_node(node) {
  return ["tag", "style", "script"].indexOf(node.type) !== -1;
}

/**
 *
 *
 * @param {*} node
 * @returns
 */
function is_text_node(node) {
  return node.type === "text";
}

module.exports = {
  has_non_empty_attribute,
  attribute_value,
  is_tag_node,
  is_text_node,
  is_self_closing,
  get_attribute,
  has_attribute,
  attribute_has_value
};
