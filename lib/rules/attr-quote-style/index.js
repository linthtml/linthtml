var Issue = require("../../issue");

const formats = {
  double: { regex: /^"/, desc: "double quoted" },
  single: { regex: /^'/, desc: "single quoted" },
  quoted: { regex: /^['"]/, desc: "quoted" }
};

module.exports = {
  name: "attr-quote-style",
  on: ["tag"],
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

module.exports.lint = function(node, opts) {
  if (node.type !== "tag" || node.attribs === undefined) {
    return [];
  }
  let issues = [];
  let attributes = Object.values(node.attribs);
  // TODO: Remove after `raw-ignore-text` refacto
  attributes = attributes.filter(attribute => /^¤+$/.test(attribute.rawName) === false);
  let format = formats[opts[this.name]];
  attributes.forEach(attribute => {

    const value = attribute.rawValue;
    if (value && !format.regex.test(value)) {
      var msgData = {
        attribute: attribute.name,
        format: format.desc
      };
      issues.push(new Issue("E005", attribute.valueLineCol, msgData));
    }
  });
  return issues;
};
