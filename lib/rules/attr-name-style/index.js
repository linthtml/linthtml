var Issue = require("../../issue"),
  proc = require("../../process_option");
const { isRegExp } = require("util");

module.exports = {
  name: "attr-name-style",
  on: ["tag"],
  options: [
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

module.exports.lint = function(node, config) {
  const format = config[this.name];
  let issues = [];
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
      issues.push(new Issue("E002", attribute.nameLineCol, { format }));
    }
  });
  return issues;
};
