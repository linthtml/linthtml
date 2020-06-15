const { isTagNode, getClasses, has_attribute, attribute_value } = require("../../knife/tag_utils");

module.exports = {
  name: "class-no-dup",
  on: ["dom"],
  need: "dom"
};

function filterClasses(classes, options) {
  const ignore = options["id-class-ignore-regex"];

  // TODO: Remove after `raw-ignore-text` refacto
  classes = classes.filter(_ => /^¤+$/.test(_) === false);
  if (ignore) {
    classes = classes.filter(_class => !ignore.test(_class));
  }
  return classes;
}

module.exports.lint = function(node, options, { report }) {
  if (isTagNode(node) === false || has_attribute(node, "class") === false) {
    return;
  }
  const class_attribute = attribute_value(node, "class");
  let classes = filterClasses(get_classes(class_attribute), options);
  // const classes_position = classes.lineCol;
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
};
