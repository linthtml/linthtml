const { is_tag_node, attribute_value, has_attribute } = require("../../knife/tag_utils");

module.exports = {
  name: "id-no-dup",
  table: {},
  on: ["dom"],
  need: "dom"
};

module.exports.end = function() {
  // wipe previous table
  this.table = {};
};

module.exports.lint = function(node, opts, { report }) {
  if (is_tag_node(node) === false || has_attribute(node, "id") === false) {
    return;
  }
  const id = attribute_value(node, "id");
  // TODO: Remove after `raw-ignore-text` refacto
  if (/^¤+$/.test(id.chars)) {
    return [];
  }
  // node has a duplicate id
  if (this.table[id.chars] !== undefined) {
    report({
      code: "E012",
      position: id.loc,
      meta: {
        data: {
          id: id.chars
        }
      }
    });
  }
  // if we haven't seen the id before, remember it
  // and pass the node
  this.table[id.chars] = node;
};
