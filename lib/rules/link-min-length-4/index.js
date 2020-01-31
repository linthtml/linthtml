const { attributeValue } = require("../../knife");

module.exports = {
  name: "link-min-length-4",
  on: ["tag"],
  need: "tag",
  filter: ["a"]
};

function get_text_content(node) {
  if (node.type === "comment") {
    return "";
  }
  if (node.type === "text") {
    return node.data;
  }
  return node.children.reduce((content, child) => `${content}${get_text_content(child)}`, "");
}
module.exports.lint = function(element, opts, { report }) {
  // Will add a rule to enfore href attibute on link
  if (!element.attribs.href || !element.attribs.href.value) {
    return [];
  }
  const content = get_text_content(element).trim();

  // TODO: need to deal with aria-labelledby
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
