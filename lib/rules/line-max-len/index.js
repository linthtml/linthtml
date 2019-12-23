const { stringOrRegexp } = require("../../validate_option");

module.exports = {
  name: "line-max-len",
  on: ["line"],
  need: "line",
  validateConfig(option) {
    if (typeof option !== "number") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected number got ${typeof option}`);
    }
    if (option < 0) {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Only positive indent value are allowed.`);
    }
    return option;
  },
  options: [
    // REMOVE: For the v1
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

module.exports.lint = function(line, opts, { report }) {
  const maxLength = opts[this.name];
  const ignoreRegExp = opts[this.name + "-ignore-regex"];

  const lineText = line.text.replace(/(\r\n|\n|\r)$/, "");

  if (ignoreRegExp && ignoreRegExp.match(lineText) === null) {
    return [];
  }

  const len = lineText.length;

  if (len > maxLength) {
    report({
      code: "E040",
      position: [line.line, len],
      meta: {
        data: {
          maxlength: maxLength,
          length: len
        }
      }
    });
  }
};
