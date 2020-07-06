const { isVoidElement } = require("../../knife");
const { is_tag_node, is_self_closing } = require("../../knife/tag_utils");

module.exports = {
  name: "tag-close",
  on: ["dom"],
  need: "dom",
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
      validateConfig(option) {
        if (typeof option !== "string") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string got ${typeof option}`);
        }
        if (["always", "never"].indexOf(option) === -1) {
          throw new Error(`Configuration for rule "${this.name}" is invalid: "${option}" is not accepted. Accepted values are "always" and "never".`);
        }
        return option;
      }
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
    if (isVoidElement(node.name)) {
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
