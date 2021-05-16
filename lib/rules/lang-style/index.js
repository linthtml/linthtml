const { check_lang_attribute } = require("../../knife");
const { is_tag_node, attribute_value, has_non_empty_attribute } = require("../../knife/tag_utils");

const RULE_NAME = "lang-style";

function validateConfig(style) {
  if (typeof style === "string" && style !== "case") {
    throw new Error(`Configuration for rule "${this.name}" is invalid: Only "case" is accepted as string value`);
  }

  if (typeof style !== "boolean" && typeof style !== "string") {
    throw new Error(`Configuration for rule "${this.name}" is invalid: Expected boolean got ${typeof style}`);
  }

  return style;
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} lang_case
 * @param {*} param2
 */
function lint(node, lang_case, { report }) {
  if (is_tag_node(node) === false || node.name !== "html") {
    return;
  }

  if (has_non_empty_attribute(node, "lang") === false) {
    return;
  }

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
  if (lang_case === "case" && valid === 2) {
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

module.exports = {
  name: RULE_NAME,
  validateConfig,
  lint
};
