const knife = require("../../knife");

module.exports = {
  name: "input-radio-req-name",
  on: ["tag"],
  need: "tag",
  filter: ["input"]
};

module.exports.lint = function(element, opts, { report }) {
  // if it's not a radio-type input, ignore it
  const a = element.attribs;
  if (!(a.type && a.type.value === "radio")) {
    return [];
  }

  if (knife.hasNonEmptyAttr(element, "name") === false) {
    report({
      code: "E034",
      position: element.openLineCol
    });
  }
};
