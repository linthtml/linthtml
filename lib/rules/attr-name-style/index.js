const proc = require("../../process_option");
/* eslint-disable-next-line */
const { isRegExp } = require("util");

module.exports = {
  name: "attr-name-style",
  on: ["tag"],
  need: "tag",
  validateConfig(format) {
    if (typeof format === "string" || isRegExp(format) === true) {
      return format;
    }
    throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string or RegExp got ${typeof format}`);
  },
  options: [
    // REMOVE: For the v1
    // Need to duplicate validateConfig to make it works with the old and the new Config system ><
    {
      validateConfig(format) {
        if (typeof format === "string" || isRegExp(format) === true) {
          return format;
        }
        throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string or RegExp got ${typeof format}`);
      }
    },
    {
      name: "attr-name-ignore-regex",
      validateConfig(format) {
        if (typeof format === "string" || isRegExp(format) === true) {
          return format;
        }
        throw new Error(`Configuration for rule attr-name-ignore-regex is invalid: Expected string or RegExp got ${typeof format}`);
      },
      rules: []
    }
  ]
};

module.exports.lint = function(node, config, { report }) {
  const format = config[this.name];
  let attributes = Object.values(node.attribs);
  // TODO: Remove after `raw-ignore-text` refacto
  attributes = attributes.filter(attribute => /^¤+$/.test(attribute.rawName) === false);
  const ignore = config["attr-name-ignore-regex"];
  if (ignore) {
    const R = proc.regex(ignore);
    attributes = attributes.filter(attribute => R.test(attribute.rawName) === false);
  }

  attributes.forEach(attribute => {
    if (proc.regex(format).test(attribute.rawName) === false) {
      report({
        code: "E002",
        position: attribute.nameLineCol,
        meta: {
          data: {
            format
          }
        }
      });
    }
  });
};
