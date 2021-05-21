const Issue = require("../../issue");
const { is_tag_node, attribute_value, attribute_has_value } = require("../../knife/tag_utils");

const RULE_NAME = "input-req-label";

function isInputOrLabel(node) {
  return ["input", "label"].indexOf(node.name) !== -1;
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
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

  if (attribute_has_value(node, "type", "hidden")) {
    return;
  }

  if (attribute_has_value(node, "type", "button")) {
    const value = attribute_value(node, "value");
    if (value === null || value.chars.trim() === "") {
      return report({
        code: "E033",
        position: node.open.loc,
        meta: {
          data: {
            idValue: "null"
          }
        }
      });
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
}

// REMOVE
function end() {
  const issues = [];
  this.inputsInfo
    .forEach(({ id, loc }) => {
      if (!this.labels[id]) {
        issues.push(
          new Issue(
            this.name,
            loc,
            {
              code: "E033",
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
}

module.exports = {
  name: RULE_NAME,
  lint,
  end,

  labels: {},
  inputsInfo: []
};
