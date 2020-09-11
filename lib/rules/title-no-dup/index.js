const { is_tag_node } = require("../../knife/tag_utils");

module.exports = {
  name: "title-no-dup",
  on: "dom"
};

module.exports.lint = function(node, opts, { report }) {
  if (is_tag_node(node) === false || node.name !== "head") {
    return;
  }
  const titles = node.children.filter(child => child.name === "title");

  if (titles.length > 1) {
    titles.slice(1)
      .forEach(title => report({
        code: "E028",
        position: title.open.loc,
        meta: {
          data: {
            num: titles.length
          }
        }
      }));
  }
};
