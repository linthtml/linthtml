const { is_tag_node, has_non_empty_attribute } = require("../../knife/tag_utils");

module.exports = {
  name: "img-req-alt",
  on: "dom",
  validateConfig(option) {
    if (typeof option === "string" && option !== "allownull") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Only "allownull" is accepted as string value`);
    }

    if (typeof option !== "boolean" && typeof option !== "string") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected boolean got ${typeof option}`);
    }

    return option;
  }
};

module.exports.lint = function(node, opts, { report }) {
  if (is_tag_node(node) === false || node.name !== "img") {
    return;
  }
  const opt = opts[this.name];
  if (has_non_empty_attribute(node, "alt", opt === "allownull") === false) {
    report({
      code: "E013",
      position: node.open.loc
    });
  }
};
