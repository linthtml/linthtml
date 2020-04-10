const { attributeValue } = require("../../knife");
const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "link-min-length-4",
  on: ["dom"],
  need: "dom"
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
  if (isTagNode(element) === false || element.name !== "a") {
    return;
  }
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
