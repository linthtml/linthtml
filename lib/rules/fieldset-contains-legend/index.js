const { is_tag_node } = require("../../knife/tag_utils");

module.exports = {
  name: "fieldset-contains-legend",
  on: "dom"
};

module.exports.lint = function(element, opts, { report }) {
  if (is_tag_node(element) === false || element.name !== "fieldset") {
    return;
  }
  const has_legend = element.children.some(node => node.name === "legend");

  if (has_legend === false) {
    report({
      code: "E063",
      position: element.open.loc
    });
  }
};
