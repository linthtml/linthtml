module.exports = {
  name: "head-valid-content-model",
  on: ["tag"],
  need: "tag",
  filter: ["head"]
};

module.exports.lint = function(node, opts, { report }) {
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
