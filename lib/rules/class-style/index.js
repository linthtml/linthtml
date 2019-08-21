const Issue = require("../../issue");
const proc = require("../../process_option");
const { isRegExp } = require("util");

module.exports = {
  name: "class-style",
  on: ["class"],
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
    // TODO: Remove ` /^¤+$/.test(c)` after `raw-ignore-text` refacto
      return !(ignore_class[i] || /^¤+$/.test(c) || regex.test(c));
    })
    .map(function(c) {
      return new Issue("E011", classes.lineCol, {
        attribute: "class",
        format: format,
        value: c
      });
    });
};
