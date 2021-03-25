const { is_tag_node, get_classes, has_attribute, attribute_value } = require("../../knife/tag_utils");

const RULE_NAME = "class-no-dup";

function filterClasses(classes, options) {
  const ignore = options["id-class-ignore-regex"];

  // TODO: Remove after `raw-ignore-text` refacto
  classes = classes.filter(_ => /^¤+$/.test(_) === false);
  if (ignore) {
    classes = classes.filter(_class => !ignore.test(_class));
  }
  return classes;
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} opts
 * @param {*} param2
 */
function lint(node, options, { report }) {
  if (is_tag_node(node) === false || has_attribute(node, "class") === false) {
    return;
  }
  const class_attribute = attribute_value(node, "class");
  let classes = filterClasses(get_classes(class_attribute), options);
  classes = classes.sort();
  for (let i = 0; i < classes.length - 1; i++) {
    if (classes[i + 1] === classes[i]) {
      report({
        code: "E041",
        position: class_attribute.loc,
        meta: {
          data: { classes: classes[i] }
        }
      });
    }
  }
}

module.exports = {
  name: RULE_NAME,
  lint
};
