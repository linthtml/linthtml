import type { RuleDefinition } from "../../read-config.js";
import { create_string_or_regexp_validator } from "../../validate_option.js";

const RULE_NAME = "attr-name-ignore-regex";

export default {
  deprecated: true,
  deprecation_hint:
    "This is not a rule. It's a setting that will be used by real rules to ignore some attribute based on their names",
  name: RULE_NAME,
  validateConfig: create_string_or_regexp_validator(RULE_NAME),
  lint() {}
} as RuleDefinition;
