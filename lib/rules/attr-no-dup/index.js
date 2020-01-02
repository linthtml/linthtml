module.exports = {
  name: "attr-no-dup",
  on: ["tag"],
  need: "tag"
};

module.exports.lint = function(element, opts, { report }) {
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
