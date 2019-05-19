const knife = require("../../knife");
const Issue = require("../../issue");

module.exports = {
  name: "img-req-alt",
  on: ["tag"],
  filter: ["img"],
  desc: [
    "* `true`: Each `img` tag must have a non-empty `alt` property.",
    '* "allownull": Each `img` tag must have an `alt` property with a value,',
    '    but value may be null (equal to `""`).',
    "* `false`: No restriction."
  ].join("\n"),
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
