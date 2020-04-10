const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "head-valid-content-model",
  on: ["dom"],
  need: "dom"
};

module.exports.lint = function(node, opts, { report }) {
  if (isTagNode(node) === false || node.name !== "head") {
    return;
  }

  const legal_children = [
    "base",
    "link",
    "meta",
    "noscript",
    "script",
    "style",
    "template",
    "title"
  ];

  node.children
    .filter(child => child.type === "tag" && legal_children.indexOf(child.name) < 0)
    .forEach(child => report({
      code: "E047",
      position: child.openLineCol
    }));
};
