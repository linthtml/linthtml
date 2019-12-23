module.exports = {
  name: "href-style",
  on: ["tag"],
  need: "tag",
  filter: ["a"],
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

module.exports.lint = function(element, opts, { report }) {
  const format = opts[this.name];
  const attr = element.attribs;

  // TODO: Should return an issue, since a without href is bad
  if (attr.href === undefined || attr.href === null) {
    return [];
  }

  const href = attr.href.value;
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
      position: element.openLineCol,
      meta: {
        data: {
          format: format
        }
      }
    });
  }
};
