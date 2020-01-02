const formats = {
  double: { regex: /^"/, desc: "double quoted" },
  single: { regex: /^'/, desc: "single quoted" },
  quoted: { regex: /^['"]/, desc: "quoted" }
};

module.exports = {
  name: "attr-quote-style",
  on: ["tag"],
  need: "tag",

  validateConfig(option) {
    if (typeof option !== "string") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected "double", "simple" or "quoted" got ${typeof option}.`);
    }
    if (/^(double|single|quoted)$/.test(option) === false) {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected "double", "simple" or "quoted" got "${option}".`);
    }
    return option;
  }
};

module.exports.lint = function(node, opts, { report }) {
  if (node.type !== "tag" || node.attribs === undefined) {
    return [];
  }
  let attributes = Object.values(node.attribs);
  // TODO: Remove after `raw-ignore-text` refacto
  attributes = attributes.filter(attribute => /^¤+$/.test(attribute.rawName) === false);
  const format = formats[opts[this.name]];
  attributes.forEach(attribute => {
    const value = attribute.rawValue;
    if (value && !format.regex.test(value)) {
      const msgData = {
        attribute: attribute.name,
        format: format.desc
      };
      report({
        code: "E005",
        position: attribute.valueLineCol,
        meta: {
          data: msgData
        }
      });
    }
  });
};
