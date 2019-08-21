const Issue = require("../../issue");
const { stringOrRegexp } = require("../../validate_option");

module.exports = {
  name: "line-max-len",
  on: ["line"],
  options: [
    {
      validateConfig(option) {
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
      validateConfig: stringOrRegexp,
      rules: []
    }
  ]
};

module.exports.lint = function(line, opts) {
  var maxLength = opts[this.name],
    ignoreRegExp = opts[this.name + "-ignore-regex"];

  var lineText = line.text.replace(/(\r\n|\n|\r)$/, "");

  if (ignoreRegExp && ignoreRegExp.match(lineText) === null) {
    return [];
  }

  var len = lineText.length;

  return len > maxLength
    ? new Issue("E040", [line.line, len], { maxlength: maxLength, length: len })
    : [];
};
