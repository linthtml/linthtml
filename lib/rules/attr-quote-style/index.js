const { is_tag_node } = require("../../knife/tag_utils");
const { create_list_value_validator } = require("../../validate_option");

const RULE_NAME = "attr-quote-style";

const formats = {
  double: { regex: /^"/, desc: "double quoted" },
  single: { regex: /^'/, desc: "single quoted" },
  quoted: { regex: /^['"]/, desc: "quoted" }
};

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} opts
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false) {
    return [];
  }
  // TODO: Remove after `raw-ignore-text` refacto
  const attributes = node.attributes.filter(({ name }) => /^¤+$/.test(name.chars) === false);
  const format = formats[config];
  attributes.forEach(attribute => {
    const { value } = attribute;
    if (value && !format.regex.test(value.raw)) {
      report({
        code: "E005",
        position: attribute.value.loc,
        meta: {
          data: {
            attribute: attribute.name.chars,
            format: format.desc
          }
        }
      });
    }
  });
}

module.exports = {
  name: RULE_NAME,
  validateConfig: create_list_value_validator(["double", "single", "quoted"], false),
  lint
};
