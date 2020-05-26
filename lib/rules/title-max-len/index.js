const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "title-max-len",
  on: ["dom"],
  need: "dom",
  validateConfig(option) {
    if (typeof option !== "number") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected number got ${typeof option}`);
    }
    if (option < 0) {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Only positive indent value are allowed.`);
    }
    return option;
  }
};

module.exports.lint = function(node, opts, { report }) {
  if (isTagNode(node) === false || node.name !== "title") {
    return;
  }
  const maxlen = opts[this.name];

  const text = node.children
    .filter(function(c) {
      return c.type === "text";
    })
    .map(function(c) {
      return c.data;
    })
    .join("");
  if (text.length > maxlen) {
    report({
      code: "E029",
      position: node.openLineCol,
      meta: {
        data: {
          title: text,
          maxlength: maxlen
        }
      }
    });
  }
};
