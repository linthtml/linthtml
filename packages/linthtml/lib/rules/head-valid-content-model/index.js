// TODO: Find a way to get rid of `dist/lib`
const { is_tag_node } = require("@linthtml/dom-utils/dist/lib/tags");

const RULE_NAME = "head-valid-content-model";

const legal_children = [
  "base",
  "link",
  "meta",
  "noscript",
  "script",
  "style",
  "template",
  "title"
];

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || node.name !== "head") {
    return;
  }

  node.children
    .filter(child => child.type === "tag" && legal_children.indexOf(child.name) < 0)
    .forEach(child => report({
      code: "E047",
      position: child.open.loc
    }));
}

module.exports = {
  name: RULE_NAME,
  lint
};
