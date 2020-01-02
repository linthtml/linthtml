module.exports = {
  name: "table-req-caption",
  on: ["tag"],
  need: "tag",
  filter: ["table"]
};

module.exports.lint = function(node, opts, { report }) {
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
