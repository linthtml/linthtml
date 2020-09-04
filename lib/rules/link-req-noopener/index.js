const { is_tag_node, attribute_has_value } = require("../../knife/tag_utils");

module.exports = {
  name: "link-req-noopener",
  on: ["dom"]
};

module.exports.lint = function(node, opts, { report }) {
  if (is_tag_node(node) === false || node.name !== "a") {
    return;
  }

  const noopen = /(^| )(noopener|noreferrer)( |$)/;

  if (attribute_has_value(node, "target", "_blank") && attribute_has_value(node, "rel", noopen) === false) {
    report({
      code: "E058",
      position: node.open.loc
    });
  }
};

// <base target="_blank" />
// https://html.com/attributes/base-target/
