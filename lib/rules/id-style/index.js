const match_format = require("../../utils/check_format");
const { is_tag_node } = require("../../knife/tag_utils");
const {
  create_list_value_validator
} = require("../../validate_option");
const { types: { isRegExp } } = require("util");

const RULE_NAME = "id-style";

// TODO: Deal with id attribute without value (<div id>)
/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, format, { report, global_config }) {
  if (is_tag_node(node) === false || format === "none") {
    return;
  }

  let ignore = global_config["id-class-ignore-regex"];

  // TODO: Remove after `raw-ignore-text` refacto
  let attributes = node.attributes.filter(({ name }) => /^¤+$/.test(name.chars) === false);
  // TODO: Remove after `raw-ignore-text` refacto
  attributes = attributes.filter(({ name }) => name.chars.toLowerCase() === "id");
  attributes = attributes.filter(({ value }) => value && /^¤+$/.test(value.raw) === false);
  if (ignore) {
    ignore = isRegExp(ignore)
      ? ignore
      : new RegExp(ignore);
    attributes = attributes.filter(({ value }) => ignore.test(value.chars) === false); // raw or chars ?
  }
  attributes.forEach(attribute => {
    const id = attribute.value.chars;
    if (match_format(format, id) === false) {
      report({
        code: "E011",
        position: attribute.loc,
        meta: {
          data: {
            attribute: "id",
            format: format,
            value: id
          }
        }
      });
    }
  });
}

module.exports = {
  name: RULE_NAME,
  validateConfig: create_list_value_validator(["none", "lowercase", "underscore", "dash", "camel", "bem"]),
  lint
};
