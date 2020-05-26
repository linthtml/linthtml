const { hasNonEmptyAttr, checkLangTag } = require("../../knife");
const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "lang",
  on: ["dom"],
  need: "dom",
  options: [{
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
    lint(element, opts, { report }) {
      if (isTagNode(element) === false || element.name !== "html") {
        return;
      }
      const attr = element.attribs;
      const _case = opts["lang-style"];
      if (attr && attr.lang) {
        const lang = attr.lang.value;

        // TODO: Remove after `raw-ignore-text` refacto
        if (/^¤+$/.test(lang)) {
          return [];
        }

        const valid = checkLangTag(lang); // WHAT???
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
  }, {
    name: "html-req-lang",
    lint(node, opts, { report }) {
      if (isTagNode(node) === false || node.name !== "html") {
        return;
      }
      if (hasNonEmptyAttr(node, "lang") === false) {
        report({
          code: "E025",
          position: node.openLineCol
        });
      }
    }
  }]
};

module.exports.lint = function(node, opts, { rules, report }) {
  if (isTagNode(node) === false || node.name !== "html") {
    return;
  }
  if (rules === undefined) {
    return legacy_lint(node, opts, report);
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
      const valid = checkLangTag(lang); // WHAT???
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
