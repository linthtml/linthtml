const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "attr-validate";

function get_attributes_raw({ open }) {
  const open_raw = open.raw;
  return open_raw.replace(/^</, "")
    .replace((new RegExp(`^${open.chars} `)), "")
    .replace(/\/?>$/, "");
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false) {
    return;
  }
  /* eslint-disable-next-line no-useless-escape */
  const attrRegex = /^\s*([^ "'>=\^]+(\s*=\s*(("[^"]*")|('[^']*')|([^ \t\n"']+)))?\s+)*$/;
  const attributes_raw = get_attributes_raw(node);
  // Get rid of `+ " "`
  if (attrRegex.test(attributes_raw + " ") === false) {
    report({
      code: "E049",
      position: node.open.loc
    });
  }
}

// TODO: check if this rule still work as expected

module.exports = {
  name: RULE_NAME,
  lint
};
