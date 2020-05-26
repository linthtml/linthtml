const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "link-req-noopener",
  on: ["dom"],
  need: "dom"
};

function getVal(a/*, value */) {
  return a && a.value;
}

module.exports.lint = function(element, opts, { report }) {
  if (isTagNode(element) === false || element.name !== "a") {
    return;
  }

  const noopen = /(^| )(noopener|noreferrer)( |$)/;

  const attrs = element.attribs;
  if (getVal(attrs.target) === "_blank" && !noopen.test(getVal(attrs.rel))) {
    report({
      code: "E058",
      position: element.openLineCol
    });
  }
};

// <base target="_blank" />
// https://html.com/attributes/base-target/
