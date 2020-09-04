const match_format = require("../../utils/check_format");
const { is_tag_node } = require("../../knife/tag_utils");
const { create_string_or_regexp_validator } = require("../../validate_option");

module.exports = {
  name: "attr-name-style",
  on: "dom",
  validateConfig: create_string_or_regexp_validator(),
  options: [
    // REMOVE: For the v1
    // Need to duplicate validateConfig to make it works with the old and the new Config system ><
    {
      validateConfig: create_string_or_regexp_validator()
    },
    {
      name: "attr-name-ignore-regex",
      validateConfig: create_string_or_regexp_validator(),
      rules: []
    }
  ]
};

module.exports.lint = function(node, config, { report }) {
  if (is_tag_node(node) === false) {
    return;
  }

  const format = config[this.name];
  // TODO: Remove after `raw-ignore-text` refacto
  let attributes = node.attributes.filter(({ name }) => /^¤+$/.test(name.chars) === false);
  const ignore = config["attr-name-ignore-regex"];
  if (ignore) {
    attributes = attributes.filter(({ name }) => match_format(ignore, name.chars) === false);
  }

  attributes.forEach(({ name }) => {
    if (match_format(format, name.chars) === false) {
      report({
        code: "E002",
        position: name.loc,
        meta: {
          data: {
            format
          }
        }
      });
    }
  });
};
