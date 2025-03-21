import type { RuleDefinition } from "../../read-config.js";
import { create_string_or_regexp_validator } from "../../validate_option.js";

const RULE_NAME = "line-max-len-ignore-regex";

export default {
  name: RULE_NAME,
  deprecated: true,
  deprecation_hint: "This is not a rule, it's a deprecated setting doing nothing currently.",
  validateConfig: create_string_or_regexp_validator(RULE_NAME),
  lint() {}
} as RuleDefinition;
