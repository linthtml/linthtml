var Issue = require("../../issue");

module.exports = {
  name: "class-no-dup",
  on: ["class"]
};

module.exports.lint = function(classes/*, opts*/) {
  let issues = [];
  const classes_position = classes.lineCol;
  classes = classes.sort();

  // TODO: Remove after `raw-ignore-text` refacto
  classes = classes.filter(_ => /^¤+$/.test(_) === false);
  for (var i = 0; i < classes.length - 1; i++) {
    if (classes[i + 1] === classes[i]) {
      issues.push(new Issue("E041", classes_position, { classes: classes[i] }));
    }
  }
  return issues;
};
