import match_format from "../../utils/check_format.js";
import { is_tag_node } from "@linthtml/dom-utils";
import {
  create_list_value_validator,
  create_object_validator,
  create_string_or_regexp_validator,
  run_validation_for_option_key
} from "../../validate_option.js";
import { types } from "node:util";
import type { LegacyLinterConfig, reportFunction, RuleDefinition } from "../../read-config.js";
import type { Node } from "@linthtml/dom-utils/dom_elements";

const { isRegExp } = types;

// TODO: Deprecate "attr-name-ignore-regex" "rule" and add a setting to ignore attribute to this rule
const RULE_NAME = "attr-name-style";

type RULE_CONFIG_SIMPLE = "camel" | "regexp" | "lowercase" | "dash" | RegExp;
type RULE_CONFIG_EXTENDED = { format: "camel" | "regexp" | "lowercase" | "dash" | RegExp; ignore?: string | RegExp };
type RULE_CONFIG = RULE_CONFIG_SIMPLE | RULE_CONFIG_EXTENDED;

function is_extended_config(config: RULE_CONFIG): config is RULE_CONFIG_EXTENDED {
  return typeof config === "object" && !isRegExp(config) && !Array.isArray(config);
}

function lint(
  node: Node,
  config: RULE_CONFIG,
  { report, global_config }: { report: reportFunction; global_config: LegacyLinterConfig }
) {
  if (is_tag_node(node)) {
    const format = is_extended_config(config) ? config.format : config;
    const ignore = is_extended_config(config)
      ? config.ignore ?? global_config["attr-name-ignore-regex"]
      : global_config["attr-name-ignore-regex"];

    // TODO: Remove after `raw-ignore-text` refacto
    let attributes = node.attributes.filter(({ name }) => /^¤+$/.test(name.chars) === false);
    if (ignore) {
      const R_ignore = isRegExp(ignore) ? ignore : new RegExp(ignore);
      attributes = attributes.filter(({ name }) => match_format(R_ignore, name.chars) === false);
    }

    attributes.forEach(({ name }) => {
      if (match_format(format, name.chars) === false) {
        report({
          code: "E002",
          position: name.loc,
          meta: {
            data: {
              format: format.toString(),
              attribute: name.chars
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
      create_list_value_validator(RULE_NAME, ["lowercase", "underscore", "dash", "camel", "bem"], true),
      "format"
    )(config);

    if (config.ignore) {
      run_validation_for_option_key(create_string_or_regexp_validator(RULE_NAME), "ignore")(config);
    }

    return config;
  } else {
    return create_list_value_validator(RULE_NAME, ["lowercase", "underscore", "dash", "camel", "bem"], true)(config);
  }
}

export default {
  name: RULE_NAME,
  validateConfig,
  lint
} as RuleDefinition;
