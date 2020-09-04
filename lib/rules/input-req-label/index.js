const Issue = require("../../issue");
const { is_tag_node, attribute_value } = require("../../knife/tag_utils");

module.exports = {
  name: "input-req-label",
  on: ["dom"],

  labels: {},
  inputsInfo: []
};

// REMOVE
module.exports.end = function() {
  const issues = [];
  this.inputsInfo
    .forEach(({ id, loc }) => {
      if (!this.labels[id]) {
        issues.push(
          new Issue(
            "E033",
            loc,
            this.name,
            {
              data: {
                idValue: id
              }
            })
        );
      }
    });

  // wipe previous table
  this.labels = {};
  this.inputsInfo = [];

  return issues;
};

function isInputOrLabel(node) {
  return ["input", "label"].indexOf(node.name) !== -1;
}

module.exports.lint = function(node, opts, { report }) {
  if (is_tag_node(node) === false || isInputOrLabel(node) === false) {
    return;
  }

  // if it's a label with a 'for', store that value
  if (node.name === "label") {
    const for_attribute = attribute_value(node, "for");
    if (for_attribute) {
      this.labels[for_attribute.chars] = node;
    }
    return;
  }

  // check if the input has a label as a parent.
  for (let e = node; (e = e.parent);) {
    if (e.name === "label") {
      return [];
    }
  }

  // check if the input has a named label, by storing the values to
  // check at the end.
  const id = attribute_value(node, "id");
  if (id) {
    this.inputsInfo.push({
      id: id.chars,
      loc: node.open.loc
    });
  } else {
    report({
      code: "E033",
      position: node.open.loc,
      meta: {
        data: {
          idValue: "null"
        }
      }
    });
  }
};
