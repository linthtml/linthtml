const Issue = require("../../issue");

module.exports = {
  name: "attr-no-dup",
  on: ["tag"],
  desc: "If set, the same attribute name cannot be repeated within a single tag.",
  process(o) {
    if (typeof o !== "boolean") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected boolean got ${typeof o}`);
    }
    return o;
  }
};

module.exports.lint = function(element/*, opts*/) {
  return element.dupes.map(function(n) {
    var a = element.attribs[n];

    return new Issue("E003", a.nameLineCol, { attribute: n });
  });
};
