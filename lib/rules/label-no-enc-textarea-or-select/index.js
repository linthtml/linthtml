module.exports = {
  name: "label-no-enc-textarea-or-select",
  on: ["tag"],
  need: "tag",
  filter: ["label"]
};

function findSelectTextarea(element) {
  if (element.name === "select" || element.name === "textarea") {
    return true;
  }
  return element.children ? element.children.some(findSelectTextarea) : false;
}

module.exports.lint = function(element, opts, { report }) {
  const has_nested_select = element.children.some(findSelectTextarea);
  if (has_nested_select) {
    report({
      code: "E062",
      position: element.openLineCol
    });
  }
};
