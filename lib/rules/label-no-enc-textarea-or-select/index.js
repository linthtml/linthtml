const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "label-no-enc-textarea-or-select";

function findSelectTextarea(element) {
  if (element.name === "select" || element.name === "textarea") {
    return true;
  }
  return element.children ? element.children.some(findSelectTextarea) : false;
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(element, config, { report }) {
  if (is_tag_node(element) === false || element.name !== "label") {
    return;
  }
  const has_nested_select = element.children.some(findSelectTextarea);
  if (has_nested_select) {
    report({
      code: "E062",
      position: element.open.loc
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
