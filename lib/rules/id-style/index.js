const match_format = require("../../utils/check_format");
const { is_tag_node } = require("../../knife/tag_utils");
const lintClassStyle = require("../class-style").lint;
const {
  create_list_value_validator,
  create_string_or_regexp_validator
} = require("../../validate_option");

module.exports = {
  name: "id-style",
  on: ["dom"],
  need: "dom",
  validateConfig: create_list_value_validator(["lowercase", "underscore", "dash", "camel", "bem"]),
  options: [
    // REMOVE: For the v1
    // Need to duplicate validateConfig to make it works with the old and the new Config system ><
    {
      need: "dom",
      validateConfig: create_list_value_validator(["lowercase", "underscore", "dash", "camel", "bem"])
    },
    {
      name: "id-class-style", // REMOVE: A rule be standalone and not call other rules
      validateConfig: create_list_value_validator(["lowercase", "underscore", "dash", "camel", "bem"]),
      rules: ["class-style", "id-style"],
      lint(node, opts, { report, rules }) {
        if (!!rules["id-style"] === false && rules["id-class-style"]) {
          const ignore = opts["id-class-ignore-regex"];
          lint(node, opts["id-class-style"], ignore, report);
        }
        if (!!rules["class-style"] === false && rules["id-class-style"]) {
          lintClassStyle(node, opts, { report });
        }
      }
    },
    {
      name: "id-class-ignore-regex",
      validateConfig: create_string_or_regexp_validator(false),
      rules: [] // 'class', 'id-style'
    }
  ]
};

module.exports.lint = function(node, opts, { report, rules }) {
  if (is_tag_node(node) === false) {
    return;
  }
  let format;
  if (rules) {
    format = opts["id-style"];
  } else {
    format = opts["id-style"] || opts["id-class-style"];
  }
  const ignore = opts["id-class-ignore-regex"];
  return lint(node, format, ignore, report);
};

// Deal with id attribut without value (<div id>)
function lint(node, format, ignore, report) {
  // TODO: Remove after `raw-ignore-text` refacto
  let attributes = node.attributes.filter(({ name }) => /^¤+$/.test(name.chars) === false);
  // TODO: Remove after `raw-ignore-text` refacto
  attributes = attributes.filter(({ name }) => name.chars.toLowerCase() === "id");
  attributes = attributes.filter(({ value }) => /^¤+$/.test(value.raw) === false);
  if (ignore) {
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
