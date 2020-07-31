const match_format = require("../../utils/check_format");
const { is_tag_node } = require("../../knife/tag_utils");
const { stringOrRegexp } = require("../../validate_option");

module.exports = {
  name: "attr-name-style",
  on: ["dom"],
  need: "dom",
  validateConfig: stringOrRegexp,
  options: [
    // REMOVE: For the v1
    // Need to duplicate validateConfig to make it works with the old and the new Config system ><
    {
      validateConfig: stringOrRegexp
    },
    {
      name: "attr-name-ignore-regex",
      validateConfig: stringOrRegexp,
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
