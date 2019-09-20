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
      filter: ["html"],

      validateConfig(style) {
        if (typeof style === "string" && style !== "case") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Only "case" is accepted as string value`);
        }
    
        if (typeof style !== "boolean" && typeof style !== "string") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Expected boolean got ${typeof style}`);
        } 
    
        return style;
      },
      lint(element, opts) {
        const attr = element.attribs;
        const _case = opts["lang-style"];
        if (attr && attr.lang) {

          const lang = attr.lang.value;

          // TODO: Remove after `raw-ignore-text` refacto
          if (/^¤+$/.test(lang)) {
            return [];
          }

          const valid = knife.checkLangTag(lang); // WHAT???
          if (valid === 1) {
            return new Issue("E038", attr.lang.valueLineCol, { lang });
          }
          if (_case === "case" && valid === 2) {
            return new Issue("E039", attr.lang.valueLineCol, { lang });
          }
        }
        return [];
      }
    },
    {
      name: "html-req-lang",
      filter: ["html"],
      lint(element) {
        const attr = element.attribs;
        if (attr && attr.lang) {
          return [];
        }
        return  new Issue("E025", element.openLineCol);
      }
    }
  ]
};

module.exports.lint = function(element, opts, rules) {
  // console.log("rules")
  // console.log(element.name)
  if (rules !== undefined) {
    return [];
  }
  return legacy_lint(element, opts);
};

function legacy_lint(element, opts) {
  var a = element.attribs;
  if (a && a.lang) {
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
}
