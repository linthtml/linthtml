const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "attr-no-dup",
  on: ["dom"],
  need: "dom"
};

module.exports.lint = function(element, opts, { report }) {
  if (isTagNode(element) === false) {
    return;
  }
  return element.dupes.map(function(n) {
    const a = element.attribs[n];

    report({
      code: "E003",
      position: a.nameLineCol,
      meta: {
        data: {
          attribute: n
        }
      }
    });
  });
};
