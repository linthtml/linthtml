const knife = require("../../knife");
const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "tag-req-attr",
  on: ["dom"],
  need: "dom",
  validateConfig(options) {
    if (typeof options !== "object") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected object got ${typeof options}`);
    }
    return options;
  }
};

module.exports.lint = function(element, opts, { report }) {
  if (isTagNode(element) === false) {
    return;
  }
  const tags = opts[this.name];

  for (const tagName in tags) {
    if (tagName === element.name) {
      const requiredAttributes = tags[tagName];
      const elementAttributes = element.attribs;

      requiredAttributes.forEach(function(attribute) {
        const elementAttribute = elementAttributes[attribute.name];
        const allowEmpty =
            typeof attribute.allowEmpty === "undefined"
              ? false
              : attribute.allowEmpty;

        if (
          typeof elementAttribute === "undefined" ||
          (!allowEmpty && !knife.hasNonEmptyAttr(element, attribute.name))
        ) {
          report({
            code: "E057",
            position: element.openLineCol,
            meta: {
              data: {
                attribute: attribute.name,
                tag: element.name
              }
            }
          });
        }
      });
    }
  }
};
