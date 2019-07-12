var Issue = require("../../issue");

module.exports = {
  name: "href-style",
  on: ["tag"],
  filter: ["a"],
  desc: [
    '* "absolute": All `href` tags must use absolute URLs.',
    '* "relative": All `href` tags must use relative URLs.',
    "* `false`: No restriction.",
    "Links to fragments (that is, those starting with `#`) are not checked."
  ].join("\n"),
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

module.exports.lint = function(element, opts) {
  var format = opts[this.name],
    attr = element.attribs;

  // Should return an issue, since a without href is bad
  if (!attr.hasOwnProperty("href")) {
    return [];
  }

  const href = attr.href.value;
  // TODO: Remove after `raw-ignore-text` refacto
  if (/^¤+$/.test(href)) {
    return [];
  }

  // Allow fragment-only URLs
  if (href.startsWith("#")) {
    return [];
  }

  // Link must be absolute iff specified format is absolute
  var isAbsolute = href.search("://") !== -1;
  return isAbsolute === (format === "absolute")
    ? []
    : new Issue("E009", element.openLineCol, { format: format });
};
