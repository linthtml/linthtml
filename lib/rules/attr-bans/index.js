const { types: { isRegExp } } = require("util");
const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "attr-bans";
function validateConfig(config) {
  const typeError = (type) => `Configuration for rule "${this.name}" is invalid: Expected string, RegExp or (string|RegExp)[] got ${type}`;
  if (Array.isArray(config)) {
    config.forEach(attr => {
      const type = typeof attr;
      if (type !== "string" && isRegExp(attr) === false) {
        throw new Error(typeError(`${type}[]`));
      }
    });
    return config;
  }
  if (typeof config === "string" || isRegExp(config)) {
    return config;
  }
  throw new Error(typeError(typeof config));
}

function mut_config(options) {
  if (Array.isArray(options)) {
    return options.map(option => {
      const type = typeof option;
      if (type === "string") {
        return option.toLowerCase();
      }
      if (isRegExp(option)) {
        return option;
      }
      return option;
    });
  }
  if (typeof options === "string" || isRegExp(options)) {
    options = [options];
  }
  if (typeof options === "boolean") {
    options = [];
  }
  return options;
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false) {
    return;
  }

  const banned_attrs = mut_config(config);

  function addIssue(attribute) {
    report({
      code: "E001",
      position: attribute.loc,
      meta: {
        data: {
          attribute: attribute.name.chars.toLowerCase()
        }
      }
    });
  }

  banned_attrs.forEach(banned => {
    const attributes = node.attributes.filter(({ name }) => {
      const attribute_name = name.chars.toLowerCase();
      if (isRegExp(banned)) {
        return banned.test(attribute_name) === true;
      }
      return attribute_name === banned;
    });
    attributes.forEach(addIssue);
  });
}

module.exports = {
  name: RULE_NAME,
  validateConfig,
  lint
};
