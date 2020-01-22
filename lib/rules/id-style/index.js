const proc = require("../../process_option");
/* eslint-disable-next-line */
const { isRegExp } = require("util");
const lintClassStyle = require("../class-style").lint;

module.exports = {
  name: "id-style",
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
      need: "tag",
      validateConfig(format) {
        if (typeof format === "string" || isRegExp(format) === true) {
          return format;
        }
        throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string or RegExp got ${typeof format}`);
      }
    },
    {
      name: "id-class-style",
      validateConfig(option) {
        if (typeof option !== "string" && isRegExp(option) === false) {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string|regexp got ${typeof option}`);
        }

        if (["none", "lowercase", "underscore", "dash", "camel", "bem"].indexOf(option) === -1 && isRegExp(option) === false) {
          throw new Error(`Configuration for rule "${this.name}" is invalid: "${option}" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem".`);
        }
        return option;
      },
      rules: ["class-style", "id-style"],
      lint(node, opts, { report, rules }) {
        if (rules["id-style"] || rules["id-class-style"]) {
          return [];
        }
        const ignore = opts["id-class-ignore-regex"];
        lint(node, opts["id-class-style"], ignore, report);
        lintClassStyle(node, opts, { report });
      }
    },
    {
      name: "id-class-ignore-regex",
      validateConfig(options) {
        if ((typeof options === "string" && options !== "") || isRegExp(options) === true) {
          return options;
        }
        if (typeof options === "string") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: You provide an empty string value`);
        }
        throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string or RegExp got ${typeof options}`);
      },
      rules: [] // 'class', 'id-style'
    }
  ]
};

module.exports.lint = function(node, opts, { report, rules }) {
  let format;
  if (rules) {
    format = opts["id-style"];
  } else {
    format = opts["id-style"] || opts["id-class-style"];
  }
  const ignore = opts["id-class-ignore-regex"];
  return lint(node, format, ignore, report);
};

function lint(node, format, ignore, report) {
  let attributes = Object.values(node.attribs);
  // TODO: Remove after `raw-ignore-text` refacto
  attributes = attributes.filter(attribute => /^¤+$/.test(attribute.rawName) === false);
  // TODO: Remove after `raw-ignore-text` refacto
  attributes = attributes.filter(attribute => attribute.rawName === "id");
  attributes = attributes.filter(attribute => /^¤+$/.test(attribute.value) === false);
  if (ignore) {
    attributes = attributes.filter(attribute => ignore.test(attribute.value) === false);
  }
  attributes.forEach(attribute => {
    const id = attribute.value;
    const regex = proc.regex(format);
    if (regex.test(id) === false) {
      report({
        code: "E011",
        position: attribute.valueLineCol,
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
