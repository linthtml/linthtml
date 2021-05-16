const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "title-no-dup";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || node.name !== "head") {
    return;
  }
  const titles = node.children.filter(child => child.name === "title");

  if (titles.length > 1) {
    titles.slice(1)
      .forEach(title => report({
        code: "E028",
        position: title.open.loc,
        meta: {
          data: {
            num: titles.length
          }
        }
      }));
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
