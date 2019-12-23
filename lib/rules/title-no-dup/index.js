module.exports = {
  name: "title-no-dup",
  on: ["tag"],
  need: "tag",
  filter: ["head"]
};

module.exports.lint = function(head, opts, { report }) {
  const titles = head.children.filter(child => child.name === "title");

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
