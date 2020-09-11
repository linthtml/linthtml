const { is_tag_node } = require("../../knife/tag_utils");

module.exports = {
  name: "tag-name-lowercase",
  on: "dom"
};

module.exports.lint = function(node, opts, { report }) {
  if (is_tag_node(node) === true && /[A-Z]/.test(node.open.chars)) {
    report({
      code: "E017",
      position: node.open.loc,
      data: {
        name: node.name
      }
    });
  }
};
