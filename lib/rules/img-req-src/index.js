const knife = require("../../knife");

module.exports = {
  name: "img-req-src",
  on: ["tag"],
  need: "tag",
  filter: ["img"]
};

module.exports.lint = function(element, opts, { report }) {
  if (knife.hasNonEmptyAttr(element, "src") === false) {
    report({
      code: "E014",
      position: element.openLineCol
    });
  }
};
