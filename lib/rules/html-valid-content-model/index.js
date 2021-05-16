const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "html-valid-content-model";

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || node.name !== "html") {
    return;
  }
  let has_head = false;
  let has_body = false;

  node.children.filter(child => child.type === "tag")
    .forEach(function(child) {
      // E044: Illegal element
      // E045: Duplicated tag
      // E046: Head and body tags out of order
      let err;
      if (child.name === "head") {
        err = has_body ? "E046" : has_head ? "E045" : false;
        has_head = true;
      } else if (child.name === "body") {
        err = has_body ? "E045" : false;
        has_body = true;
      } else {
        err = "E044";
      }
      if (err) {
        report({
          code: err,
          position: child.open.loc
        });
      }
    });
}

module.exports = {
  name: RULE_NAME,
  lint
};
