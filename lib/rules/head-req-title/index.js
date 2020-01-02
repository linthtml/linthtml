module.exports = {
  name: "head-req-title",
  on: ["tag"],
  need: "tag",
  filter: ["head"]
};

// TODO: Should return an error if title does not have a text node has a child
module.exports.lint = function(head, opts, { report }) {
  const titles = head.children.filter(child => child.name === "title");
  const has_title_with_children = titles.some((title) => {
    return title.children.length > 0;
  });

  if (has_title_with_children === false) {
    report({
      code: "E027",
      position: head.openLineCol
    });
  }
};
