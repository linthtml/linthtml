const { attributeValue } = require("../../knife");

module.exports = {
  name: "link-min-length-4",
  on: ["tag"],
  need: "tag",
  filter: ["a"]
};

module.exports.lint = function(element, opts, { report }) {
  // Will add a rule to enfore href attibute on link
  if (!element.attribs.href || !element.attribs.href.value) {
    return [];
  }

  const textNodes = element.children.filter(node => node.type === "text");
  const content = textNodes.reduce((acc, textElement) => `${acc}${textElement.data}`, "").trim();

  if (content.length < 4 && attributeValue(element, "aria-label").length < 4) {
    report({
      code: "E059",
      position: element.openLineCol,
      meta: {
        data: {
          content
        }
      }
    });
  }
};
