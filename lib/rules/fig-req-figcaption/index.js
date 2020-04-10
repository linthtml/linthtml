const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "fig-req-figcaption",
  on: ["dom"],
  need: "dom"
};

module.exports.lint = function(node, opts, { report }) {
  if (isTagNode(node) === false) {
    return;
  }
  if (node.name === "figure") {
    // get the children of this figure
    const children = node.children;
    const has_caption = children.find(child => child.name === "figcaption");
    if (has_caption === undefined) {
      report({
        code: "E032",
        position: node.openLineCol
      });
    }
  }
  if (node.name === "figcaption") {
    if (!node.parent || node.parent.name !== "figure") {
      report({
        code: "E032",
        position: node.openLineCol
      });
    }
  }
};
