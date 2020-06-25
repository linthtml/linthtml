const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "tag-name-lowercase",
  on: ["dom"],
  need: "dom"
};

module.exports.lint = function(node, opts, { report }) {
  if (isTagNode(node) === true && /[A-Z]/.test(node.open.chars)) {
    report({
      code: "E017",
      position: node.open.loc,
      data: {
        name: node.name
      }
    });
  }
};
