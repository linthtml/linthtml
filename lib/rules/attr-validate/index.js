const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "attr-validate",
  on: ["dom"],
  need: "dom"
};

function get_attributes_raw({ open }) {
  const open_raw = open.raw;
  return open_raw.replace(/^</, "")
    .replace((new RegExp(`^${open.chars} `)), "")
    .replace(/\/?>$/, "");
}

module.exports.lint = function(node, opts, { report }) {
  if (isTagNode(node) === false) {
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
};

// TODO: check if this rule still work as expected
