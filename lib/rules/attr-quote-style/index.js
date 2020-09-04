const { is_tag_node } = require("../../knife/tag_utils");
const { create_list_value_validator } = require("../../validate_option");

const formats = {
  double: { regex: /^"/, desc: "double quoted" },
  single: { regex: /^'/, desc: "single quoted" },
  quoted: { regex: /^['"]/, desc: "quoted" }
};

module.exports = {
  name: "attr-quote-style",
  on: ["dom"],

  validateConfig: create_list_value_validator(["double", "single", "quoted"], false)
};

module.exports.lint = function(node, opts, { report }) {
  if (is_tag_node(node) === false) {
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
