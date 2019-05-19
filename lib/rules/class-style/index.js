const Issue = require("../../issue");
const proc = require("../../process_option");
const { isRegExp } = require("util");

module.exports = {
  name: "class-style",
  on: ["class"],
  desc: [
    'A format specifier, "none", or `false`. If set, `class`es must fit the',
    "given format. If `false`, the value for `id-class-style` is used",
    "instead (use `'none'` to avoid matching anything).",
    "",
    "Note that there is no symmetric `id-style` option. This maintains",
    "compatibility with older versions of LintHTML and allows a user to set",
    "both `id` and `class` styles with a single option in the common case",
    "that they are the same. To use different styles, set the `class` style",
    "with `class-style` and the `id` style with `id-class-style`."
  ].join("\n"),
  validateConfig(option) {
    if (typeof option !== "string" && isRegExp(option) === false) {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string|regexp got ${typeof option}`);
    }
    
    if (["none", "lowercase", "underscore", "dash", "camel", "bem"].indexOf(option) === -1 && isRegExp(option) === false) {
      throw new Error(`Configuration for rule "${this.name}" is invalid: "${option}" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem".`);
    }
    return option;
  }
  // 'id-class-style'
};

module.exports.lint = function(classes, opts) {
  var format = opts[this.name] || opts["id-class-style"],
    ignore_class = classes.ignore_class;

  if (format === "none") {
    return [];
  }

  let regex = proc.regex(format);

  return classes
    .filter(function(c, i) {
      return !(ignore_class[i] || regex.test(c));
    })
    .map(function(c) {
      return new Issue("E011", classes.lineCol, {
        attribute: "class",
        format: format,
        value: c
      });
    });
};
