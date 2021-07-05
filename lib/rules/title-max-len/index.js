const { is_tag_node } = require("../../knife/tag_utils");
const { create_number_validator } = require("../../validate_option");

const RULE_NAME = "title-max-len";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} max_length
 * @param {*} param2
 */
function lint(node, max_length, { report }) {
  if (is_tag_node(node) === false || node.name !== "title") {
    return;
  }

  const text = node.children
    .filter(function(c) {
      return c.type === "text";
    })
    .map(function(c) {
      return c.data;
    })
    .join("");
  if (text.length > max_length) {
    report({
      code: "E029",
      position: node.open.loc,
      meta: {
        data: {
          title: text,
          max_lengthgth: max_length
        }
      }
    });
  }
}

module.exports = {
  name: RULE_NAME,
  validateConfig: create_number_validator(false),
  lint
};
