const Issue = require("../../issue");
const knife = require("../../knife");

module.exports = {
  name: "lang",
  on: ["tag"],
  need: "tag",
  filter: ["html"],
  options: [
    {
      name: "lang-style",
      validateConfig(style) {
        if (typeof style === "string" && style !== "case") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Only "case" is accepted as string value`);
        }
    
        if (typeof style !== "boolean" && typeof style !== "string") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Expected boolean got ${typeof style}`);
        } 
    
        return style;
      },
    },
    {
      name: "html-req-lang"
    }
  ]
};

module.exports.lint = function(element, opts) {
  var a = element.attribs;
  if (a && a.hasOwnProperty("lang")) {
    const lang = a.lang.value;

    // TODO: Remove after `raw-ignore-text` refacto
    if (/^¤+$/.test(lang)) {
      return [];
    }

    if (opts["lang-style"]) {
      var valid = knife.checkLangTag(lang); // WHAT???
      if (valid === 1) {
        return new Issue("E038", a.lang.valueLineCol, { lang });
      }
      if (opts["lang-style"] === "case" && valid === 2) {
        return new Issue("E039", a.lang.valueLineCol, { lang });
      }
    }
    return [];
  }

  return opts["html-req-lang"] ? new Issue("E025", element.openLineCol) : [];
};
