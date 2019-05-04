const Issue = require("../../issue"),
  proc = require("../../process_option");
const { isRegExp } = require("util");
module.exports = {
  name: "id-style",
  on: ["attr"],
  filter: ["id"],
  options: [
    {
      name: "id-class-style",
      desc: [
        "A format specifier, or `false`. If set, `id`s and `class`es must fit the",
        "given format. May be overridden by `class-style` for `class`es."
      ].join("\n"),
      process: proc.format,
      rules: ["class-style", "id-style"]
    },
    {
      name: "id-class-ignore-regex",
      desc: [
        "The value is either a string giving a regular expression or `false`. If",
        "set, `id`s and `class`es matching the given regular expression are ignored",
        "for the `id-class-style` rule. For example, excluding `{{...}}` classes",
        "used by Angular and other templating methods can be done with the regex",
        "`{{.*?}}`."
      ].join("\n"),
      process: function(options) {
        if ((typeof options === "string" && options !==  "") || isRegExp(options) === true) {
          return options;
        }
        if (typeof options === "string") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: You provide an empty string value`);
        }
        throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string or RegExp got ${typeof options}`);
      },
      rules: [] // 'class', 'id-style'
    }
  ]
};

module.exports.lint = function(attr, opts) {
  var format = opts["id-class-style"],
    ignore = opts["id-class-ignore-regex"],
    v = attr.value;

  return (ignore && ignore.test(v)) || format.test(v)
    ? []
    : new Issue("E011", attr.valueLineCol, {
        attribute: "id",
        format: format.desc,
        value: v
      });
};
