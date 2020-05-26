const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "title-no-dup",
  on: ["dom"],
  need: "dom"
};

module.exports.lint = function(node, opts, { report }) {
  if (isTagNode(node) === false || node.name !== "head") {
    return;
  }
  const titles = node.children.filter(child => child.name === "title");

  if (titles.length > 1) {
    titles.slice(1)
      .forEach(title => report({
        code: "E028",
        position: title.openLineCol,
        meta: {
          data: {
            num: titles.length
          }
        }
      }));
  }
};
