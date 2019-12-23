module.exports = {
  name: "focusable-tabindex-style",
  on: ["tag"],
  need: "tag",
  filter: ["a", "area", "button", "input", "img", "select", "textarea"]
};

module.exports.lint = function(element, opts, { report }) {
  if (isDisabled(element) === false) {
    const tabindex = getTabindex(element);

    if (tabindex < 0) {
      report({
        code: "E026",
        position: element.openLineCol
      });
    }
  }
};

function isDisabled(element) {
  return !!element.attribs && !!element.attribs.disabled;
}

function getTabindex(element) {
  const attributes = element.attribs;

  if (attributes && attributes.tabindex && typeof attributes !== "undefined") {
    return attributes.tabindex.value;
  }

  return 0;
}
