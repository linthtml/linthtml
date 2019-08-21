var Issue = require("../../issue"),
  proc = require("../../process_option");
const { isRegExp } = require("util");

module.exports = {
  name: "attr-name-style",
  on: ["attr"],
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

module.exports.lint = function(attr, opts) {
  var format = opts[this.name];
  
  // TODO: Remove after `raw-ignore-text` refacto
  if (/^¤+$/.test(attr.rawName)) {
    return [];
  }
  var ignore = opts["attr-name-ignore-regex"];
  if (ignore && proc.regex(ignore).test(attr.rawName)) {
    return [];
  }
  return proc.regex(format).test(attr.rawName)
    ? []
    : new Issue("E002", attr.nameLineCol, { format });
};
