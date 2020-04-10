const { hasNonEmptyAttr } = require("../../knife");
const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "button-req-content",
  on: ["dom"],
  need: "dom"
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
  if (isTagNode(element) === false || element.name !== "button") {
    return;
  }
  if (has_text_content(element) === false && hasNonEmptyAttr(element, "aria-label") === false) {
    report({
      code: "E061",
      position: element.openLineCol
    });
  }
};
