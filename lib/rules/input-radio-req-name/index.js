const knife = require("../../knife");
const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "input-radio-req-name",
  on: ["dom"],
  need: "dom"
};

module.exports.lint = function(element, opts, { report }) {
  if (isTagNode(element) === false || element.name !== "input") {
    return;
  }
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
