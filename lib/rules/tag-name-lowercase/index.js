module.exports = {
  name: "tag-name-lowercase",
  on: ["tag"],
  need: "tag"
};

module.exports.lint = function(element, opts, { report }) {
  if (/[A-Z]/.test(element.name)) {
    report({
      code: "E017",
      position: element.openLineCol
    });
  }
};
