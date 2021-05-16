const { is_tag_node, has_non_empty_attribute } = require("../../knife/tag_utils");

const RULE_NAME = "img-req-alt";

function validateConfig(option) {
  if (typeof option === "string" && option !== "allownull") {
    throw new Error(`Configuration for rule "${this.name}" is invalid: Only "allownull" is accepted as string value`);
  }

  if (typeof option !== "boolean" && typeof option !== "string") {
    throw new Error(`Configuration for rule "${this.name}" is invalid: Expected boolean got ${typeof option}`);
  }

  return option;
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || node.name !== "img") {
    return;
  }

  if (has_non_empty_attribute(node, "alt", config === "allownull") === false) {
    report({
      code: "E013",
      position: node.open.loc
    });
  }
}

module.exports = {
  name: RULE_NAME,
  validateConfig,
  lint
};
