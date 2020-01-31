const { hasNonEmptyAttr } = require("../../knife");

module.exports = {
  name: "button-req-content",
  on: ["tag"],
  need: "tag",
  filter: ["button"]
};

function has_text_content(node) {
  let result = false;
  if (node.type === "comment") {
    return result;
  }
  if (node.type === "text") {
    return node.data.trim().length > 0;
  }
  for (let i = 0; i < node.children.length; i++) {
    result = has_text_content(node.children[i]);
    if (result === true) {
      break;
    }
  }
  return result;
}

module.exports.lint = function(element, opts, { report }) {
  if (has_text_content(element) === false && hasNonEmptyAttr(element, "aria-label") === false) {
    report({
      code: "E061",
      position: element.openLineCol
    });
  }
};
