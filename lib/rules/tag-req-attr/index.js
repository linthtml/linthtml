const knife = require("../../knife");
const Issue = require("../../issue");

module.exports = {
  name: "tag-req-attr",
  on: ["tag"],
  validateConfig(options) {
    if (typeof options !== "object") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected object got ${typeof options}`);
    }
    return options;
  }
};

module.exports.lint = function(element, opts) {
  let tags = opts[this.name];
  let issues = [];

  for (var tagName in tags) {
    if (tagName === element.name) {
      const requiredAttributes = tags[tagName];
      const elementAttributes = element.attribs;

      requiredAttributes.forEach(function(attribute) {
        var elementAttribute = elementAttributes[attribute.name],
          allowEmpty =
            typeof attribute.allowEmpty === "undefined"
              ? false
              : attribute.allowEmpty;

        if (
          typeof elementAttribute === "undefined" ||
          (!allowEmpty && !knife.hasNonEmptyAttr(element, attribute.name))
        ) {
          issues.push(new Issue("E057", element.openLineCol, { attribute: attribute.name, tag: element.name }));
        }
      });
    }
  }

  return issues;
};
