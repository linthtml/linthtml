const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "table-req-header",
  on: ["dom"],
  need: "dom"
};

module.exports.lint = function(node, opts, { report }) {
  if (isTagNode(node) === false || node.name !== "table") {
    return;
  }
  const children = node.children;
  let childIndex = 0;
  let child;

  // ffwd to first rnodevant table child
  while (
    (child = children[childIndex]) &&
    (child.type !== "tag" || // skip text nodes
      (child.name && child.name.match(/(caption|colgroup)/i)))
  ) {
    childIndex++;
  }

  if (child && child.name && child.name.match(/thead/i)) {
    return [];
  }

  if (child && child.name && child.name.match(/tr/i)) {
    // Check if any child in first row is `<th>`, not just first child (which could be a text node)
    for (let i = 0, l = child.children.length; i < l; i++) {
      if (child.children[i].name && child.children[i].name === "th") {
        return [];
      }
    }
  }

  report({
    code: "E035",
    position: node.openLineCol
  });
};
