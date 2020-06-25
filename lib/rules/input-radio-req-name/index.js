const { isTagNode, has_non_empty_attribute, attribute_value } = require("../../knife/tag_utils");

module.exports = {
  name: "input-radio-req-name",
  on: ["dom"],
  need: "dom"
};

module.exports.lint = function(node, opts, { report }) {
  if (isTagNode(node) === false || node.name !== "input") {
    return;
  }
  // if it's not a radio-type input, ignore it
  const type = attribute_value(node, "type");
  if (!(type && type.chars === "radio")) {
    return [];
  }

  if (has_non_empty_attribute(node, "name") === false) {
    report({
      code: "E034",
      position: node.open.loc
    });
  }
};
