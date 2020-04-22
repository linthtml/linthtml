const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "tag-bans",
  on: ["dom"],
  need: "dom",
  validateConfig(options) {
    const typeError = (type) => `Configuration for rule "${this.name}" is invalid: Expected string or string[] got ${type}`;
    if (Array.isArray(options)) {
      return options.map(option => {
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
};

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

module.exports.lint = function(element, opts, { report }) {
  if (isTagNode(element) === false) {
    return;
  }

  const banned = mutConfig(opts[this.name]);
  if (banned.indexOf(element.name) !== -1) {
    report({
      code: "E016",
      position: element.openLineCol,
      meta: {
        data: {
          tag: element.name
        }
      }
    });
  }
};
