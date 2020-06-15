const { check_lang_attribute } = require("../../knife");
const { isTagNode, attribute_value, has_non_empty_attribute } = require("../../knife/tag_utils");

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
    lint(node, opts, { report }) {
      if (isTagNode(node) === false || node.name !== "html") {
        return;
      }
      const _case = opts["lang-style"];
      if (has_non_empty_attribute(node, "lang")) {
        const lang = attribute_value(node, "lang");

        // TODO: Remove after `raw-ignore-text` refacto
        if (/^¤+$/.test(lang.chars)) {
          return [];
        }

        const valid = check_lang_attribute(lang); // WHAT???
        if (valid === 1) {
          report({
            code: "E038",
            position: lang.loc,
            meta: {
              data: {
                lang: lang.chars
              }
            }
          });
        }
        if (_case === "case" && valid === 2) {
          report({
            code: "E039",
            position: lang.loc,
            meta: {
              data: {
                lang: lang.chars
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
      if (has_non_empty_attribute(node, "lang") === false) {
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

function legacy_lint(node, opts, report) {
  if (has_non_empty_attribute(node, "lang")) {
    const lang = attribute_value(node, "lang");
    // TODO: Remove after `raw-ignore-text` refacto
    if (/^¤+$/.test(lang.chars)) {
      return [];
    }

    if (opts["lang-style"]) {
      const valid = check_lang_attribute(lang); // WHAT???
      if (valid === 1) {
        report({
          code: "E038",
          position: lang.loc,
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
          position: lang.loc,
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
        position: node.openLineCol
      });
    }
  }
}
