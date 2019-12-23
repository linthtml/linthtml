/* eslint-disable-next-line */
const { isRegExp } = require("util");

const formats = {
  lowercase: /^[a-z\d]+$/,
  underscore: /^[a-z\d]+(_[a-z\d]+)*$/,
  dash: /^[a-z\d]+(-[a-z\d]+)*$/,
  camel: /^[a-zA-Z\d]*$/,
  bem: /^[a-z][a-z\d]*(-[a-z\d]+)*(__[a-z\d]+(-[a-z\d]+)*)?(--[a-z\d]+(-[a-z\d]+)*)?$/
};

function getRegExp(val) {
  if (isRegExp(val)) {
    return val;
  } else if (typeof val === "string") {
    return formats[val] || new RegExp(`^${val}$`, "gm");
  } else {
    return undefined;
  }
}

module.exports = {
  regex: function(regex) {
    return getRegExp(regex);
  },
  regexGlobal: function(r) {
    r = module.exports.regex(r);
    return r && new RegExp(r.source, r.ignoreCase ? "gi" : "g");
  },
  format: function(name) {
    const regex = getRegExp(name, function(s) {
      return formats[s];
    });

    return regex && { desc: name, test: regex.test.bind(regex) };
  }
};
