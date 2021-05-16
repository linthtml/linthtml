const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "fieldset-contains-legend";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(element, config, { report }) {
  if (is_tag_node(element) === false || element.name !== "fieldset") {
    return;
  }
  const has_legend = element.children.some(node => node.name === "legend");

  if (has_legend === false) {
    report({
      code: "E063",
      position: element.open.loc
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
