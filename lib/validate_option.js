/* eslint-disable-next-line */
const { isRegExp } = require("util");

module.exports = {
  isBool: function(option) {
    if (typeof option !== "boolean") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected boolean got ${typeof option}`);
    }
    return option;
  },

  stringOrRegexp(format) {
    if (typeof format === "string" || isRegExp(format) === true) {
      return format;
    }
    throw new Error(`Configuration for rule attr-name-ignore-regex is invalid: Expected string or RegExp got ${typeof format}`);
  }
};
