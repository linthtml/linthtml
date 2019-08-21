var Issue = require("../../issue");

const formats = {
  double: { regex: /^"/, desc: "double quoted" },
  single: { regex: /^'/, desc: "single quoted" },
  quoted: { regex: /^['"]/, desc: "quoted" }
};

module.exports = {
  name: "attr-quote-style",
  on: ["attr"],
  validateConfig(option) {
    if (typeof option !== "string") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected "double", "simple" or "quoted" got ${typeof option}.`);
    }
    if (/^(double|single|quoted)$/.test(option) === false) {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected "double", "simple" or "quoted" got "${option}".`);
    }
    return option;
  }
};

module.exports.lint = function(attr, opts) {
  let format = formats[opts[this.name]];

  var v = attr.rawValue;
  if (v && !format.regex.test(v)) {
    var msgData = {
      attribute: attr.name,
      format: format.desc
    };
    return new Issue("E005", attr.valueLineCol, msgData);
  }

  return [];
};
