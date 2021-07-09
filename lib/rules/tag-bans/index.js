const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "tag-bans";

function validateConfig(options) {
  const typeError = (type) => `Configuration for rule "${this.name}" is invalid: Expected string or string[] got ${type}`;
  if (Array.isArray(options)) {
    return options.forEach(option => {
      const type = typeof option;
      if (type !== "string") {
        throw new Error(typeError(`${type}[]`));
      }
    });
  }
  if (typeof options !== "string") {
    throw new Error(typeError(typeof options));
  }
}

function mutConfig(options) {
  if (Array.isArray(options)) {
    return options.map(option => {
      const type = typeof option;
      if (type === "string") {
        return option.toLowerCase();
      }
      return option;
    });
  }
  if (typeof options === "string") {
    options = [options.toLowerCase()];
  }
  return options;
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(element, config, { report }) {
  if (is_tag_node(element) === false) {
    return;
  }

  const banned_tags = mutConfig(config);
  if (banned_tags.indexOf(element.name) !== -1) {
    report({
      code: "E016",
      position: element.open.loc,
      meta: {
        data: {
          tag: element.name
        }
      }
    });
  }
}

module.exports = {
  name: RULE_NAME,
  validateConfig,
  lint
};
