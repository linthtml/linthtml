module.exports = {
  name: "doctype-html5",
  on: ["dom"],
  need: "dom",
  filter: ["directive"]
};

module.exports.lint = function(node, opts, { report }) {
  // NOTE: this does not support legacy strings or obsolete permitted doctypes
  const doctype = /^!DOCTYPE[ \t\n\f]+html[ \t\n\f]*$/i;
  const name = /!doctype/i;

  if (name.test(node.name) && !(node.data && doctype.test(node.data))) {
    report({
      code: "E008",
      position: node.lineCol
    });
  }
};
