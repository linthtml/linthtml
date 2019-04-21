const knife = require("../knife");

module.exports = {
  name: "class",
  on: ["attr"],
  filter: ["class"]
  // 'id-class-ignore-regex' (non-dependent)
};

module.exports.lint = function(attr, opts) {
  const classes_attr = attr.value.trim().split(/\s+/);

  var ignore = opts["id-class-ignore-regex"];
  var classes = [];
  // Parallel to classes; which classes are ignored
  var ignore_class = false;
  if (ignore) {
    ignore_class = [false];

    classes_attr.forEach(_class => {
      if (_class.match(ignore) === null) {
        classes.push(_class);
        ignore_class.push(false);
      } else {
        ignore_class.push(true);
      }
    });
  } else {
    classes = classes_attr;
  }

  classes.ignore_class = ignore_class;
  classes.lineCol = attr.valueLineCol;
  classes.all = classes_attr;
  return knife.applyRules(this.subscribers, classes, opts);
};
