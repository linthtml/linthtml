import { CharValue, Node } from "@linthtml/dom-utils/lib/dom_elements";
import { is_tag_node, get_classes, has_attribute, attribute_value } from "@linthtml/dom-utils/lib/tags";
import { types } from "util";
import { LegacyLinterConfig, reportFunction, RuleDefinition } from "../../read-config";

const { isRegExp } = types;

const RULE_NAME = "class-no-dup";

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

function lint(node: Node, _config: unknown, { report, global_config }: { report: reportFunction, global_config: LegacyLinterConfig }) {
  if (is_tag_node(node) && has_attribute(node, "class")) {
    const class_attribute = attribute_value(node, "class") as CharValue;
    let classes = filterClasses(get_classes(class_attribute), global_config);
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
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
