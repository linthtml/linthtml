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
      lint(element, opts, { report }) {
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
            report({
              code: "E038",
              position: attr.lang.valueLineCol,
              meta: {
                data: {
                  lang
                }
              }
            });
          }
          if (_case === "case" && valid === 2) {
            report({
              code: "E039",
              position: attr.lang.valueLineCol,
              meta: {
                data: {
                  lang
                }
              }
            });
          }
        }
      }
    },
    {
      name: "html-req-lang",
      filter: ["html"],
      lint(element, opts, { report }) {
        const attr = element.attribs;
        if (!!attr || !!attr.lang) {
          report({
            code: "E025",
            position: element.openLineCol
          });
        }
      }
    }
  ]
};

module.exports.lint = function(element, opts, { rules, report }) {
  if (rules === undefined) {
    return legacy_lint(element, opts, report);
  }
};

function legacy_lint(element, opts, report) {
  const a = element.attribs;
  if (a && a.lang) {
    const lang = a.lang.value;

    // TODO: Remove after `raw-ignore-text` refacto
    if (/^¤+$/.test(lang)) {
      return [];
    }

    if (opts["lang-style"]) {
      const valid = knife.checkLangTag(lang); // WHAT???
      if (valid === 1) {
        report({
          code: "E038",
          position: a.lang.valueLineCol,
          meta: {
            data: {
              lang
            }
          }
        });
      }
      if (opts["lang-style"] === "case" && valid === 2) {
        report({
          code: "E039",
          position: a.lang.valueLineCol,
          meta: {
            data: {
              lang
            }
          }
        });
      }
    }
  } else {
    if (opts["html-req-lang"]) {
      report({
        code: "E025",
        position: element.openLineCol
      });
    }
  }
}
