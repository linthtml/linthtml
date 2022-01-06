import match_format from "../../utils/check_format";
import { is_tag_node, attribute_value, get_classes, has_non_empty_attribute } from "@linthtml/dom-utils/lib/tags";
import { create_list_value_validator } from "../../validate_option";
import { types } from "util";
import { LegacyLinterConfig, reportFunction, RuleDefinition } from "../../read-config";
import { CharValue, Node } from "@linthtml/dom-utils/lib/dom_elements";

const { isRegExp } = types;

const RULE_NAME = "class-style";

function filterClasses(classes: string[], options: LegacyLinterConfig) {
  let ignore = options["id-class-ignore-regex"];

  // TODO: Remove after `raw-ignore-text` refacto
  classes = classes.filter(_ => /^¤+$/.test(_) === false);
  if (ignore) {
    ignore = isRegExp(ignore)
      ? ignore
      : new RegExp(ignore);
    classes = classes.filter(_class => !(ignore as RegExp).test(_class));
  }
  return classes;
}

function lint(node: Node, format: string | RegExp, { report, global_config }: { report: reportFunction, global_config: LegacyLinterConfig }) {
  if (format === "none") {
    return;
  }
  if (is_tag_node(node) && has_non_empty_attribute(node, "class")) {
    // const format = options[this.name] || options["id-class-style"];
    const class_attribute = attribute_value(node, "class") as CharValue;
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
}

export default {
  name: RULE_NAME,
  validateConfig: create_list_value_validator(RULE_NAME, ["none", "lowercase", "underscore", "dash", "camel", "bem"]),
  lint
} as RuleDefinition;
