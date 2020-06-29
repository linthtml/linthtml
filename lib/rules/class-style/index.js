/* eslint-disable-next-line */
const { isRegExp } = require("util");
const proc = require("../../process_option");
const { is_tag_node, attribute_value, has_attribute } = require("../../knife/tag_utils");

module.exports = {
  name: "class-style",
  on: ["dom"],
  need: "dom",
  validateConfig(option) {
    if (typeof option !== "string" && isRegExp(option) === false) {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string|regexp got ${typeof option}`);
    }

    if (["none", "lowercase", "underscore", "dash", "camel", "bem"].indexOf(option) === -1 && isRegExp(option) === false) {
      throw new Error(`Configuration for rule "${this.name}" is invalid: "${option}" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem".`);
    }
    return option;
  }
};

function getClasses(class_attribute) {
  return class_attribute
    ? class_attribute.chars.trim().split(" ")
    : [];
}

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

  const regex = proc.regex(format);

  classes.filter(_class => !regex.test(_class))
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
