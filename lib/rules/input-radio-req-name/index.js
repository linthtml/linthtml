const { is_tag_node, has_non_empty_attribute, attribute_value } = require("../../knife/tag_utils");

const RULE_NAME = "input-radio-req-name";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || node.name !== "input") {
    return;
  }
  // if it's not a radio-type input, ignore it
  const type = attribute_value(node, "type");
  if (!(type && type.chars === "radio")) {
    return [];
  }

  if (has_non_empty_attribute(node, "name") === false) {
    report({
      code: "E034",
      position: node.open.loc
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
