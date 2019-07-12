const Issue = require("../../issue");
const knife = require("../../knife");

module.exports = {
  name: "lang",
  on: ["tag"],
  filter: ["html"],
  options: [
    {
      name: "lang-style",
      desc: [
        "If set, the lang tag must have a valid form (`xx-YY`, where `xx` is a",
        "valid language code and `YY` is a valid country code). If the value is",
        'equal to "case", the tag must be capitalized conventionally (with the',
        "language code lowercase and the country code uppercase)."
      ].join("\n"),
      validateConfig(option) {
    
        if (typeof option === "string" && option !== "case") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Only "case" is accepted as string value`);
        }
    
        if (typeof option !== "boolean" && typeof option !== "string") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Expected boolean got ${typeof option}`);
        } 
    
        return option;
      },
    },
    {
      name: "html-req-lang",
      desc: "If set, each `html` tag must have a `lang` attribute."
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
