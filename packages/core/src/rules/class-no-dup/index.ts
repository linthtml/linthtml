import type { CharValue, Node, NodeAttribute } from "@linthtml/dom-utils/dom_elements";
import { is_tag_node, get_classes, has_attribute, get_attribute } from "@linthtml/dom-utils";
import { types } from "node:util";
import type { LegacyLinterConfig, reportFunction, RuleDefinition } from "../../read-config.js";
import { create_object_validator, create_string_or_regexp_validator } from "../../validate_option.js";

const { isRegExp } = types;

const RULE_NAME = "class-no-dup";

// TODO Remove false after Legacy linter/config removal
function filterClasses(classes: string[], ignore_regexp?: string | RegExp | false) {
  // TODO: Remove after `raw-ignore-text` refacto
  classes = classes.filter((_) => /^¤+$/.test(_) === false);
  if (ignore_regexp) {
    const ignore = isRegExp(ignore_regexp) ? ignore_regexp : new RegExp(ignore_regexp);
    classes = classes.filter((_class) => !(ignore as RegExp).test(_class));
  }
  return classes;
}

function lint(
  node: Node,
  config: { ignore: string | RegExp } | undefined,
  { report, global_config }: { report: reportFunction; global_config: LegacyLinterConfig }
) {
  if (is_tag_node(node) && has_attribute(node, "class")) {
    const class_attribute = get_attribute(node, "class") as NodeAttribute;

    let classes = filterClasses(get_classes(class_attribute), config?.ignore ?? global_config["id-class-ignore-regex"]);

    classes = classes.sort();

    for (let i = 0; i < classes.length - 1; i++) {
      if (classes[i + 1] === classes[i]) {
        report({
          code: "E041",
          position: (class_attribute.value as CharValue).loc,
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
  validateConfig: (config?: { ignore: string | RegExp }, is_legacy = true) => {
    if (config === undefined || config === null || (is_legacy && typeof config === "boolean")) {
      return config;
    }

    create_object_validator(RULE_NAME, ["ignore"])(config);

    if (config.ignore) {
      try {
        create_string_or_regexp_validator(RULE_NAME)(config.ignore);
      } catch (error) {
        const error_message = (error as Error).message
          .replace("Configuration for", "Object configuration for")
          .replace(":", ': Setting "ignore" is not valid:');
        throw error_message;
      }
    }
  },
  lint
} as RuleDefinition;
