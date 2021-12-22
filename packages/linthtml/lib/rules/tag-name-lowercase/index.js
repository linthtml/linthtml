// TODO: Find a way to get rid of `dist/lib`
const { is_tag_node } = require("@linthtml/dom-utils/lib/tags");

const RULE_NAME = "tag-name-lowercase";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === true && /[A-Z]/.test(node.open.chars)) {
    report({
      code: "E017",
      position: node.open.loc,
      meta: {
        data: {
          name: node.name
        }
      }
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
