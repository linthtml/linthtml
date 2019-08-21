const knife = require("../../knife");
const Issue = require("../../issue");

module.exports = {
  name: "img-req-alt",
  on: ["tag"],
  filter: ["img"],
  validateConfig(option) {

    if (typeof option === "string" && option !== "allownull") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Only "allownull" is accepted as string value`);
    }

    if (typeof option !== "boolean" && typeof option !== "string") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected boolean got ${typeof option}`);
    } 

    return option;
  },
};

module.exports.lint = function(element, opts) {
  var opt = opts[this.name];
  if (element.name === "img" && knife.hasNonEmptyAttr(element, "alt", opt === "allownull")) {
    return [];
  }

  return new Issue("E013", element.openLineCol);
};
