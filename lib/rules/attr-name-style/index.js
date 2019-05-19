var Issue = require("../../issue"),
  proc = require("../../process_option");
const { isRegExp } = require("util");

module.exports = {
  name: "attr-name-style",
  on: ["attr"],
  options: [
    {
      desc: [
        "A format specifier, or `false`. If set, attribute names must conform to",
        "the given format."
      ].join("\n"),
      validateConfig(format) {
        if (typeof format === "string" || isRegExp(format) === true) {
          return format;
        }
        throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string or RegExp got ${typeof format}`);
      }
    },
    {
      name: "attr-name-ignore-regex",
      desc: [
        "A string giving a regular expression, a RegExp object, or `false`. If",
        "set, `attr`s with names matching the given regular expression are ignored",
        "for the `attr-name-style` rule. For example, excluding `{{...}}` names",
        "used by Angular and other templating methods can be done with the regex",
        "`{{.*?}}`."
      ].join("\n"),
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

  var ignore = opts["attr-name-ignore-regex"];
  if (ignore && proc.regex(ignore).test(attr.rawName)) {
    return [];
  }
  return proc.regex(format).test(attr.rawName)
    ? []
    : new Issue("E002", attr.nameLineCol, { format: format.name });
};
