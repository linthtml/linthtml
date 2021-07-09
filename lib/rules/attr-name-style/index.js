const match_format = require("../../utils/check_format");
const { is_tag_node } = require("../../knife/tag_utils");
const { create_string_or_regexp_validator } = require("../../validate_option");
const { types: { isRegExp } } = require("util");

// TODO: Deprecate "attr-name-ignore-regex" "rule" and add a setting to ignore attribute in this rule
const RULE_NAME = "attr-name-style";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} opts
 * @param {*} param2
 */
function lint(node, format, { report, global_config }) {
  if (is_tag_node(node) === false) {
    return;
  }

  // const format = config[this.name];
  // TODO: Remove after `raw-ignore-text` refacto
  let attributes = node.attributes.filter(({ name }) => /^¤+$/.test(name.chars) === false);
  let ignore = global_config["attr-name-ignore-regex"];
  if (ignore) {
    ignore = isRegExp(ignore)
      ? ignore
      : new RegExp(ignore);
    attributes = attributes.filter(({ name }) => match_format(ignore, name.chars) === false);
  }

  attributes.forEach(({ name }) => {
    if (match_format(format, name.chars) === false) {
      report({
        code: "E002",
        position: name.loc,
        meta: {
          data: {
            format,
            attribute: name.chars
          }
        }
      });
    }
  });
}

module.exports = {
  name: RULE_NAME,
  validateConfig: create_string_or_regexp_validator(),
  lint
};
