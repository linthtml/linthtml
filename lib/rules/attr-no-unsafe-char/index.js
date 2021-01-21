const { is_tag_node, attribute_has_value } = require("../../knife/tag_utils");

const RULE_NAME = "attr-no-unsafe-char";

/* eslint-disable */
const regUnsafe = /[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;
/* eslint-enable */

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} opts
 * @param {*} param2
 */
function lint(node, opts, { report }) {
  if (is_tag_node(node) === false) {
    return;
  }
  // TODO: Remove after `raw-ignore-text` refacto
  const attributes = node.attributes.filter(({ name }) => /^¤+$/.test(name.chars) === false);
  attributes.forEach(attribute => {
    if (attribute_has_value(node, attribute.name.chars, regUnsafe)) {
      report({
        code: "E004",
        position: attribute.loc,
        meta: {
          data: {
            attribute: attribute.name.chars
          }
        }
      });
    }
  });
}

module.exports = {
  name: RULE_NAME,
  lint
};
