const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "tag-name-lowercase";

function lint(node, opts, { report }) {
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
