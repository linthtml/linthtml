const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "label-no-enc-textarea-or-select",
  on: ["dom"],
  need: "dom"
};

function findSelectTextarea(element) {
  if (element.name === "select" || element.name === "textarea") {
    return true;
  }
  return element.children ? element.children.some(findSelectTextarea) : false;
}

module.exports.lint = function(element, opts, { report }) {
  if (isTagNode(element) === false || element.name !== "label") {
    return;
  }
  const has_nested_select = element.children.some(findSelectTextarea);
  if (has_nested_select) {
    report({
      code: "E062",
      position: element.openLineCol
    });
  }
};
