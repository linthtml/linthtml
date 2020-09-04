const { is_tag_node, has_non_empty_attribute } = require("../../knife/tag_utils");

module.exports = {
  name: "img-req-src",
  on: ["dom"]
};

module.exports.lint = function(node, opts, { report }) {
  if (is_tag_node(node) === false || node.name !== "img") {
    return;
  }
  if (has_non_empty_attribute(node, "src") === false) {
    report({
      code: "E014",
      position: node.open.loc
    });
  }
};
