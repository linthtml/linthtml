import match_format from "../../utils/check_format.js";
import { is_tag_node } from "@linthtml/dom-utils";
import type { LegacyLinterConfig, reportFunction, RuleDefinition } from "../../read-config.js";
import {
  create_list_value_validator,
  create_object_validator,
  create_string_or_regexp_validator,
  run_validation_for_option_key
} from "../../validate_option.js";
import { types } from "node:util";
import type { Node } from "@linthtml/dom-utils/dom_elements";

const { isRegExp } = types;

const RULE_NAME = "id-style";

type RULE_CONFIG_SIMPLE = "none" | "lowercase" | "underscore" | "dash" | "camel" | "bem" | RegExp;
type RULE_CONFIG_EXTENDED = { format: RULE_CONFIG_SIMPLE; ignore?: string | RegExp };
type RULE_CONFIG = RULE_CONFIG_SIMPLE | RULE_CONFIG_EXTENDED;

function is_extended_config(config: RULE_CONFIG): config is RULE_CONFIG_EXTENDED {
  return typeof config === "object" && !isRegExp(config) && !Array.isArray(config);
}

// TODO: Check behavoir with empty id attribute
function lint(
  node: Node,
  config: RULE_CONFIG,
  { report, global_config }: { report: reportFunction; global_config: LegacyLinterConfig }
) {
  const format = is_extended_config(config) ? config.format : config;

  if (is_tag_node(node) && format !== "none") {
    const ignore = is_extended_config(config)
      ? config.ignore ?? global_config["id-class-ignore-regex"]
      : global_config["id-class-ignore-regex"];

    // TODO: Remove after `raw-ignore-text` refacto
    let attributes = node.attributes
      .filter(({ name }) => /^¤+$/.test(name.chars) === false)
      .filter(({ name }) => name.chars.toLowerCase() === "id")
      .filter(({ value }) => value && /^¤+$/.test(value.raw as string) === false);

    if (ignore) {
      const R = isRegExp(ignore) ? ignore : new RegExp(ignore);
      attributes = attributes.filter(({ value }) => value && R.test(value.chars) === false); // raw or chars ?
    }

    attributes.forEach((attribute) => {
      const id = attribute.value?.chars as string;
      if (match_format(format, id) === false) {
        report({
          code: "E011",
          position: attribute.loc,
          meta: {
            data: {
              attribute: "id",
              format: format.toString(),
              value: id
            }
          }
        });
      }
    });
  }
}

function validateConfig(config: RULE_CONFIG) {
  if (is_extended_config(config)) {
    create_object_validator(RULE_NAME, ["format", "ignore"])(config);

    if (!config.format) {
      throw new Error(`Object configuration for rule "${RULE_NAME}" is invalid: Setting "format" is missing`);
    }

    run_validation_for_option_key(
      create_list_value_validator(RULE_NAME, ["none", "lowercase", "underscore", "dash", "camel", "bem"], true),
      "format"
    )(config);

    if (config.ignore) {
      run_validation_for_option_key(create_string_or_regexp_validator(RULE_NAME), "ignore")(config);
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
