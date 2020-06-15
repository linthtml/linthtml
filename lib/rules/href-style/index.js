const { isTagNode, has_attribute, attribute_value } = require("../../knife/tag_utils");

module.exports = {
  name: "href-style",
  on: ["dom"],
  need: "dom",
  validateConfig(option) {
    if (typeof option !== "string") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string got ${typeof option}`);
    }
    if (["absolute", "relative"].indexOf(option) === -1) {
      throw new Error(`Configuration for rule "${this.name}" is invalid: "${option}" is not accepted. Accepted values are "absolute" and "relative".`);
    }
    return option;
  }
};

module.exports.lint = function(node, opts, { report }) {
  if (isTagNode(node) === false || node.name !== "a") {
    return;
  }
  const format = opts[this.name];

  // TODO: Should return an issue, since a without href is bad
  if (has_attribute(node, "href") === false) {
    return [];
  }

  const href = attribute_value(node, "href").chars;
  // TODO: Remove after `raw-ignore-text` refacto
  if (/^¤+$/.test(href)) {
    return [];
  }

  // Allow fragment-only URLs
  const is_fragment = href.startsWith("#");
  // Link must be absolute if specified format is absolute
  const is_absolute = href.search("://") !== -1;
  const match_format = is_absolute === (format === "absolute");
  if (is_fragment === false && match_format === false) {
    report({
      code: "E009",
      position: node.openLineCol,
      meta: {
        data: {
          format: format
        }
      }
    });
  }
};
