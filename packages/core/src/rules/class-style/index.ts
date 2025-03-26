import match_format from "../../utils/check_format.js";
import { is_tag_node, get_classes, has_non_empty_attribute, get_attribute } from "@linthtml/dom-utils";
import {
  create_list_value_validator,
  create_object_validator,
  create_string_or_regexp_validator
} from "../../validate_option.js";
import { types } from "node:util";
import type { LegacyLinterConfig, reportFunction, RuleDefinition } from "../../read-config.js";
import type { CharValue, Node, NodeAttribute } from "@linthtml/dom-utils/dom_elements";

const { isRegExp } = types;

const RULE_NAME = "class-style";

type RULE_CONFIG_SIMPLE = "none" | "lowercase" | "underscore" | "dash" | "camel" | "bem" | RegExp;
type RULE_CONFIG_EXTENDED = { format: RULE_CONFIG_SIMPLE; ignore?: string | RegExp };
type RULE_CONFIG = RULE_CONFIG_SIMPLE | RULE_CONFIG_EXTENDED;

function is_extended_config(config: RULE_CONFIG): config is RULE_CONFIG_EXTENDED {
  return typeof config === "object" && !isRegExp(config) && !Array.isArray(config);
}

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
  config: RULE_CONFIG,
  { report, global_config }: { report: reportFunction; global_config: LegacyLinterConfig }
) {
  const format = is_extended_config(config) ? config.format : config;
  if (format === "none") {
    return;
  }

  if (is_tag_node(node) && has_non_empty_attribute(node, "class")) {
    const ignore = is_extended_config(config)
      ? config.ignore ?? global_config["id-class-ignore-regex"]
      : global_config["id-class-ignore-regex"];

    // const format = options[this.name] || options["id-class-style"];
    const class_attribute = get_attribute(node, "class") as NodeAttribute;
    const classes = filterClasses(get_classes(class_attribute), ignore);

    classes
      .filter((_class) => !match_format(format, _class))
      .forEach((_class) =>
        report({
          code: "E011",
          position: (class_attribute.value as CharValue).loc, // should be the location of the class and not the class_attribute
          meta: {
            data: {
              attribute: "class",
              format: format.toString(),
              value: _class
            }
          }
        })
      );
  }
}

function validateConfig(config: RULE_CONFIG) {
  if (is_extended_config(config)) {
    create_object_validator(RULE_NAME, ["format", "ignore"])(config);

    if (!config.format) {
      throw new Error(`Object configuration for rule "${RULE_NAME}" is invalid: Setting "format" is missing`);
    }

    try {
      create_list_value_validator(
        RULE_NAME,
        ["none", "lowercase", "underscore", "dash", "camel", "bem"],
        true
      )(config.format);
    } catch (error) {
      const error_message = (error as Error).message
        .replace("Configuration for", "Object configuration for")
        .replace(":", ': Setting "format" is not valid:');
      throw error_message;
    }

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

    return config;
  } else {
    return create_list_value_validator(
      RULE_NAME,
      ["none", "lowercase", "underscore", "dash", "camel", "bem"],
      true
    )(config);
  }
}

export default {
  name: RULE_NAME,
  validateConfig,
  lint
} as RuleDefinition;
