module.exports = {
  name: "fieldset-contains-legend",
  on: ["tag"],
  need: "tag",
  filter: ["fieldset"]
};

module.exports.lint = function(element, opts, { report }) {
  const has_legend = element.children.some(node => node.name === "legend");

  if (has_legend === false) {
    report({
      code: "E063",
      position: element.openLineCol
    });
  }
};
