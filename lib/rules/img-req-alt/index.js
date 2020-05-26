const { isTagNode } = require("../../knife/tag_utils");
const knife = require("../../knife");

module.exports = {
  name: "img-req-alt",
  on: ["dom"],
  need: "dom",
  validateConfig(option) {
    if (typeof option === "string" && option !== "allownull") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Only "allownull" is accepted as string value`);
    }

    if (typeof option !== "boolean" && typeof option !== "string") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected boolean got ${typeof option}`);
    }

    return option;
  }
};

module.exports.lint = function(element, opts, { report }) {
  if (isTagNode(element) === false || element.name !== "img") {
    return;
  }
  const opt = opts[this.name];
  if (knife.hasNonEmptyAttr(element, "alt", opt === "allownull") === false) {
    report({
      code: "E013",
      position: element.openLineCol
    });
  }
};
