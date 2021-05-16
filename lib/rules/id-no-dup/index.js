const { is_tag_node, attribute_value, has_non_empty_attribute } = require("../../knife/tag_utils");

const RULE_NAME = "id-no-dup";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || has_non_empty_attribute(node, "id") === false) {
    return;
  }
  const id = attribute_value(node, "id");
  // TODO: Remove after `raw-ignore-text` refacto
  if (/^¤+$/.test(id.chars)) {
    return [];
  }
  // node has a duplicate id
  const usedId = this.table[id.chars];
  if (usedId !== undefined) {
    report({
      code: "E012",
      position: id.loc,
      meta: {
        data: {
          id: id.chars,
          line: usedId.loc.start.line,
          column: usedId.loc.start.column
        }
      }
    });
  }
  // if we haven't seen the id before, remember it
  // and pass the node
  this.table[id.chars] = id;
}

function end() {
  // wipe previous table
  this.table = {};
}

module.exports = {
  name: RULE_NAME,
  lint,
  end,

  table: {}
};
