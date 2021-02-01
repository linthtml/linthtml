const { is_tag_node, has_non_empty_attribute } = require("../../knife/tag_utils");

const RULE_NAME = "html-req-lang";

function lint(node, opts, { report }) {
  if (is_tag_node(node) === false || node.name !== "html") {
    return;
  }
  if (has_non_empty_attribute(node, "lang") === false) {
    report({
      code: "E025",
      position: node.open.loc
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
