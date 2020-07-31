const { is_tag_node } = require("../../knife/tag_utils");
const { create_validation_for_numbers } = require("../../validate_option");

module.exports = {
  name: "title-max-len",
  on: ["dom"],
  need: "dom",
  validateConfig: create_validation_for_numbers(false)
};

module.exports.lint = function(node, opts, { report }) {
  if (is_tag_node(node) === false || node.name !== "title") {
    return;
  }
  const maxlen = opts[this.name];

  const text = node.children
    .filter(function(c) {
      return c.type === "text";
    })
    .map(function(c) {
      return c.data;
    })
    .join("");
  if (text.length > maxlen) {
    report({
      code: "E029",
      position: node.open.loc,
      meta: {
        data: {
          title: text,
          maxlength: maxlen
        }
      }
    });
  }
};
