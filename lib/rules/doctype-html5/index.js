const RULE_NAME = "doctype-html5";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  // NOTE: this does not support legacy strings or obsolete permitted doctypes
  const doctype = /^!DOCTYPE[ \t\n\f]+html[ \t\n\f]*$/i;
  const name = /!doctype/i;

  if (name.test(node.name) && !(node.data && doctype.test(node.data))) {
    report({
      code: "E008",
      position: node.loc
    });
  }
}

module.exports = {
  name: RULE_NAME,
  lint,

  filter: ["directive"] // remove filter
};
