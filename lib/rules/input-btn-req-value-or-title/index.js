const { has_non_empty_attribute } = require("../../knife");
const { is_tag_node, attribute_value } = require("../../knife/tag_utils");

const RULE_NAME = "input-btn-req-value-or-title";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || node.name !== "input") {
    return;
  }
  const type = attribute_value(node, "type");
  const value = attribute_value(node, "value");
  const title = attribute_value(node, "title");
  if (!type || ["button", "submit", "reset"].indexOf(type.chars) === -1) {
    return [];
  }

  if (!(value || title || has_non_empty_attribute(node, "aria-label"))) {
    report({
      code: "E060",
      position: node.open.loc
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};

// Valid for axe-core
/*
<input type="button" value="button"/>

<input type="button" title="button" />

<input type="button" aria-labelledby="foo">
<span id="foo">Button</span>

<input type="button" aria-label="button" />

*/
