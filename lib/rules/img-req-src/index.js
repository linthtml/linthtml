const { isTagNode } = require("../../knife/tag_utils");
const { hasNonEmptyAttr } = require("../../knife");

module.exports = {
  name: "img-req-src",
  on: ["dom"],
  need: "dom"
};

module.exports.lint = function(element, opts, { report }) {
  if (isTagNode(element) === false || element.name !== "img") {
    return;
  }
  if (hasNonEmptyAttr(element, "src") === false) {
    report({
      code: "E014",
      position: element.openLineCol
    });
  }
};
