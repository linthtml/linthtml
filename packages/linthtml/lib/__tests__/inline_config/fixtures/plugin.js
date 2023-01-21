module.exports = {
  rules: [
    {
      name: "my-plugin/rule",
      lint(node, format, { report }) {
        report({
          code: "something",
          position: node.loc
        });
      }
    }
  ]
};
