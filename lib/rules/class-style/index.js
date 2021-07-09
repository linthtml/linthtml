const match_format = require("../../utils/check_format");
const { is_tag_node, attribute_value, get_classes, has_non_empty_attribute } = require("../../knife/tag_utils");
const { create_list_value_validator } = require("../../validate_option");
const { types: { isRegExp } } = require("util");

const RULE_NAME = "class-style";

function filterClasses(classes, options) {
  let ignore = options["id-class-ignore-regex"];

  // TODO: Remove after `raw-ignore-text` refacto
  classes = classes.filter(_ => /^¤+$/.test(_) === false);
  if (ignore) {
    ignore = isRegExp(ignore)
      ? ignore
      : new RegExp(ignore);
    classes = classes.filter(_class => !ignore.test(_class));
  }
  return classes;
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} opts
 * @param {*} param2
 */
// Deal with class attribute with no value (<div class>)
function lint(node, format, { report, global_config }) {
  if (is_tag_node(node) === false || has_non_empty_attribute(node, "class") === false) {
    return [];
  }
  // const format = options[this.name] || options["id-class-style"];
  if (format === "none") {
    return [];
  }
  const class_attribute = attribute_value(node, "class");
  const classes = filterClasses(get_classes(class_attribute), global_config);

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

module.exports = {
  name: RULE_NAME,
  validateConfig: create_list_value_validator(["none", "lowercase", "underscore", "dash", "camel", "bem"]),
  lint
};
