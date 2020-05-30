const { isTagNode, getClasses } = require("../../knife/tag_utils");

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
  if (isTagNode(node) === false || node.attribs.class === undefined) {
    return;
  }

  let classes = filterClasses(getClasses(node), options);
  // const classes_position = classes.lineCol;
  classes = classes.sort();
  for (let i = 0; i < classes.length - 1; i++) {
    if (classes[i + 1] === classes[i]) {
      report({
        code: "E041",
        position: node.attribs.class.valueLineCol,
        meta: {
          data: { classes: classes[i] }
        }
      });
    }
  }
};
