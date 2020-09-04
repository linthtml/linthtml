const match_format = require("../../utils/check_format");
const { is_tag_node, attribute_value, has_attribute } = require("../../knife/tag_utils");
const { create_list_value_validator } = require("../../validate_option");

module.exports = {
  name: "class-style",
  on: "dom",
  validateConfig: create_list_value_validator(["none", "lowercase", "underscore", "dash", "camel", "bem"])
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

// Deal with class attribute with no value (<div class>)
function lint(node, options, { report }) {
  if (is_tag_node(node) === false || has_attribute(node, "class") === false) {
    return [];
  }
  const format = options[this.name] || options["id-class-style"];
  if (format === "none") {
    return [];
  }
  const class_attribute = attribute_value(node, "class");
  const classes = filterClasses(getClasses(class_attribute), options);

  classes.filter(_class => !match_format(format, _class))
    .forEach(_class => report({
      code: "E011",
      position: class_attribute.loc, // should be the location of the class and not the class_attribute
      meta: {
        data: {
          attribute: "class",
          format: format,
          value: _class
        }
      }
    }));
}

module.exports.lint = lint;
