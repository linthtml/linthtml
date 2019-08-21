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
      validateConfig(option) {
        if (typeof option !== "string" && isRegExp(option) === false) {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string|regexp got ${typeof option}`);
        }
        
        if (["none", "lowercase", "underscore", "dash", "camel", "bem"].indexOf(option) === -1 && isRegExp(option) === false) {
          throw new Error(`Configuration for rule "${this.name}" is invalid: "${option}" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem".`);
        }
        return option;
      },
      rules: ["class-style", "id-style"]
    },
    {
      name: "id-class-ignore-regex",
      validateConfig(options) {
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
  const format = opts["id-class-style"];
  const ignore = opts["id-class-ignore-regex"];
  const id = attr.value;
  // TODO: Remove after `raw-ignore-text` refacto
  if (/^¤+$/.test(id)) {
    return [];
  }
  const regex = proc.regex(format);
  return (ignore && ignore.test(id)) || regex.test(id)
    ? []
    : new Issue("E011", attr.valueLineCol, {
        attribute: "id",
        format: format,
        value: id
      });
};
