const { types: { isRegExp } } = require("util");

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

module.exports = function(format, value) {
  // return error is provided format does not exist
  const R = getRegExp(format);
  if (R) {
    return R.test(value);
  }
  throw new Error(`Unknown format ${format}`);
};
