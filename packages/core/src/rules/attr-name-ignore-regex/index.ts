import type { RuleDefinition } from "../../read-config.js";
import { create_string_or_regexp_validator } from "../../validate_option.js";

const RULE_NAME = "attr-name-ignore-regex";

export default {
  deprecated: true,
  deprecation_hint:
    'This is not a rule, but a setting used by the rule "attr-name-style". It can can be replaced by defining "ignore" in "attr-name-style" rule config',
  name: RULE_NAME,
  validateConfig: create_string_or_regexp_validator(RULE_NAME),
  lint() {}
} as RuleDefinition;
