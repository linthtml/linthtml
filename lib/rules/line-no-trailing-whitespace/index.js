const { is_text_node, has_parent_node } = require("../../knife/tag_utils");

const RULE_NAME = "line-no-trailing-whitespace";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_text_node(node) === false) {
    return;
  }
  const sibling_line = node.nextSibling ? node.nextSibling.loc.start.line : -1;
  const node_start_line = node.loc.start.line;
  const parent_close_line = has_parent_node(node)
    ? node.parent.loc.end.line
    : -1;
  const lines = node.data.split(/\n/);
  lines.forEach((text, offset) => {
    const text_line = node_start_line + offset;
    const match = /( )+$/.exec(text);
    if (match && text_line !== sibling_line && text_line !== parent_close_line) {
      report({
        code: "E055",
        position: {
          start: {
            line: node.loc.start.line + offset,
            column: match.index + 1
          },
          end: {
            line: node.loc.start.line + offset,
            column: text.length + 1
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
