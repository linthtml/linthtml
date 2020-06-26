const { isTagNode } = require("../../knife/tag_utils");

const formats = {
  double: { regex: /^"/, desc: "double quoted" },
  single: { regex: /^'/, desc: "single quoted" },
  quoted: { regex: /^['"]/, desc: "quoted" }
};

module.exports = {
  name: "attr-quote-style",
  on: ["dom"],
  need: "dom",

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
  if (isTagNode(node) === false) {
    return [];
  }
  // TODO: Remove after `raw-ignore-text` refacto
  const attributes = node.attributes.filter(({ name }) => /^¤+$/.test(name.chars) === false);
  const format = formats[opts[this.name]];
  attributes.forEach(attribute => {
    const { value } = attribute;
    if (value && !format.regex.test(value.raw)) {
      const msgData = {
        attribute: attribute.name.chars,
        format: format.desc
      };
      report({
        code: "E005",
        position: attribute.value.loc,
        meta: {
          data: msgData
        }
      });
    }
  });
};
