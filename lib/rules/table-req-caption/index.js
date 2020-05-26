const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "table-req-caption",
  on: ["dom"],
  need: "dom"
};

module.exports.lint = function(node, opts, { report }) {
  if (isTagNode(node) === false || node.name !== "table") {
    return;
  }
  const has_caption = node.children.some(function(c) {
    return c.name === "caption";
  });
  if (has_caption === false) {
    report({
      code: "E031",
      position: node.openLineCol
    });
  }
};
