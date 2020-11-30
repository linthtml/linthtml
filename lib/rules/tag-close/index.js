const { is_void_node } = require("../../knife");
const { is_tag_node, is_self_closing } = require("../../knife/tag_utils");
const { create_list_value_validator } = require("../../validate_option");

module.exports = {
  name: "tag-close",
  on: "dom",
  options: [

    // REMOVE: For the v1
    {
    },
    // REMOVE: For the v1
    {
      name: "tag-name-match"
    },
    {
      name: "tag-self-close",
      validateConfig: create_list_value_validator(["always", "never"], false)
    }
  ]
};

module.exports.lint = function(node, opts, { report }) {
  if (is_tag_node(node) === false) {
    return;
  }
  const { name, open, close } = node;
  // If the tag did not close itself
  // remove toLowerCase
  if (!close || name.toLowerCase() !== close.chars.toLowerCase()) {
    if (is_void_node(node)) {
      const selfClose = is_self_closing(node);
      const style = opts["tag-self-close"];
      if (
        (style === "always" && !selfClose) ||
        (style === "never" && selfClose)
      ) {
        report({
          code: "E018",
          position: node.open.loc,
          meta: {
            data: {
              expect: style
            }
          }
        });
      }
    } else {
      if (opts["tag-close"]) {
        report({
          code: "E042",
          position: node.open.loc
        });
      }
    }
  } else {
    if (opts["tag-name-match"] && open.chars !== close.chars) {
      report({
        code: "E030",
        position: node.close.loc
      });
    }
  }
};
