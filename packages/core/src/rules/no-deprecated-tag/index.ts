import { is_tag_deprecated, is_tag_node, node_tag_name, type Node } from "@linthtml/dom-utils";
// import { attribute_value, has_non_empty_attribute, is_tag_node } from "@linthtml/dom-utils";
import type { reportFunction, RuleDefinition } from "../../read-config.js";
import { create_object_validator, get_config_type, run_validation_for_option_key } from "../../validate_option.js";

const RULE_NAME = "no-deprecated-tag";

type RULE_CONFIG = {
  allowList: string[];
};

const DEFAULT_CONFIG = { allowList: [] };

function lint(node: Node, config: RULE_CONFIG, { report }: { report: reportFunction }) {
  if (!is_tag_node(node)) {
    return;
  }

  if (is_tag_deprecated(node) && !config.allowList.includes(node_tag_name(node))) {
    report({
      code: "E068",
      position: node.loc,
      meta: {
        data: node_tag_name(node)
      }
    });
  }
}
function validate_string_array(config: unknown) {
  if (get_config_type(config) !== "array") {
    throw new Error(
      `Configuration for rule "${RULE_NAME}" is invalid: Expected array of string got ${get_config_type(config)}.`
    );
  }

  const has_only_string_values = (config as []).every((value) => get_config_type(value) === "string");

  if (!has_only_string_values) {
    throw new Error(`Configuration for rule "${RULE_NAME}" is invalid: Only string values are allowed inside array.`);
  }

  return config;
}

export default {
  name: RULE_NAME,
  configTransform(config, is_legacy) {
    if (is_legacy) {
      return get_config_type(config) === "boolean" ? DEFAULT_CONFIG : config;
    }
    return config ?? DEFAULT_CONFIG;
  },
  validateConfig: (config?: { allowList: string[] }, is_legacy = true) => {
    if (config === undefined || config === null || (is_legacy && typeof config === "boolean")) {
      return config;
    }
    create_object_validator(RULE_NAME, ["allowList"])(config);

    run_validation_for_option_key(validate_string_array, "allowList")(config);
  },
  lint
} as RuleDefinition;
