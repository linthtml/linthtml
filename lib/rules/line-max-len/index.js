const Issue = require("../../issue");
const { isRegExp } = require("util");

module.exports = {
  name: "line-max-len",
  on: ["line"],
  options: [
    {
      desc: [
        "The value of this option is either `false` or a positive integer. If it",
        "is a number, the length of each line must not exceed that number."
      ].join("\n"),
      process(option) {
        if (typeof option !== "number") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Expected number got ${typeof option}`);
        }
        if (option < 0) {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Only positive indent value are allowed.`);
        }
        return option;
      }
    },
    {
      name: "line-max-len-ignore-regex",
      desc: [
        "A string giving a regular expression, a RegExp object, or `false`. If",
        "set, lines with names matching the given regular expression are ignored",
        "for the `line-length` rule. For example, lines with long `href` attributes",
        "can be excluded with regex `href`."
      ].join("\n"),
      process(format) {
        if (typeof format === "string" || isRegExp(format) === true) {
          return format;
        }
        throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string or RegExp got ${typeof format}`);
      },
      rules: []
    }
  ]
};

module.exports.lint = function(line, opts) {
  var maxLength = opts[this.name],
    ignoreRegExp = opts[this.name + "-ignore-regex"];

  var lineText = line.line.replace(/(\r\n|\n|\r)$/, "");

  if (ignoreRegExp && ignoreRegExp.match(lineText) === null) {
    return [];
  }

  var len = lineText.length;

  return len > maxLength
    ? new Issue("E040", [line.row, len], { maxlength: maxLength, length: len })
    : [];
};
