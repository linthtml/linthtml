var Issue = require("../../issue");

const formats = {
  double: { regex: /^"/, desc: "double quoted" },
  single: { regex: /^'/, desc: "single quoted" },
  quoted: { regex: /^['"]/, desc: "quoted" }
};

module.exports = {
  name: "attr-quote-style",
  on: ["attr"],
  desc: [
    '* "double": Attribute values must be quoted using double quotes.',
    '* "single": Attribute values must be quoted using single quotes.',
    '* "quoted": Attribute values must be quoted.',
    "* `false`: No restriction.",
    "",
    "Applies only to attributes with values (including the empty quoted values",
    "`''` and `\"\"`). To catch attributes with no values, use `attr-req-value`."
  ].join("\n"),
  process: function(o) {
    if (typeof o !== "string") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected "double", "simple" or "quoted" got ${typeof o}.`);
    }
    if (/^(double|single|quoted)$/.test(o) === false) {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected "double", "simple" or "quoted" got "${o}".`);
    }
    return o;
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
