const { isTagNode } = require("../../knife/tag_utils");
const { hasNonEmptyAttr } = require("../../knife");

module.exports = {
  name: "focusable-tabindex-style",
  on: ["dom"],
  need: "dom"
};

function isLinkable(node) {
  const isLink = ["a", "area"].indexOf(node.name) !== -1;
  return isLink ? hasNonEmptyAttr(node, "href", true) : false;
}

function isFocusableNode(node) {
  const isFocusableNatively =
    ["button", "input", "select", "textarea"].indexOf(node.name) !== -1;

  return (
    isFocusableNatively || isLinkable(node) || hasNonEmptyAttr(node, "tabindex")
  );
}

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

module.exports.lint = function(element, opts, { report }) {
  if (
    isTagNode(element) === false ||
    isFocusableNode(element) === false
  ) {
    return;
  }
  if (isDisabled(element) === false) {
    const tabindex = getTabindex(element);

    if (tabindex > 0) {
      report({
        code: "E026",
        position: element.openLineCol
      });
    }
  }
};
