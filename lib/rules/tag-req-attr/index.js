const { is_tag_node, has_attribute, has_non_empty_attribute } = require("../../knife/tag_utils");

const RULE_NAME = "tag-req-attr";

function validateConfig(options) {
  if (typeof options !== "object") {
    throw new Error(`Configuration for rule "${this.name}" is invalid: Expected object got ${typeof options}`);
  }
  return options;
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} tags
 * @param {*} param2
 */
function lint(node, tags, { report }) {
  if (is_tag_node(node) === false) {
    return;
  }

  for (const tagName in tags) {
    if (tagName === node.name) {
      const requiredAttributes = tags[tagName];

      requiredAttributes.forEach(({ name, allowEmpty }) => {
        allowEmpty = typeof allowEmpty === "undefined"
          ? false
          : allowEmpty;

        if (!has_attribute(node, name) || !has_non_empty_attribute(node, name, allowEmpty)) {
          report({
            code: "E057",
            position: node.open.loc,
            meta: {
              data: {
                attribute: name,
                tag: node.name
              }
            }
          });
        }
      });
    }
  }
}

module.exports = {
  name: RULE_NAME,
  validateConfig,
  lint
};
