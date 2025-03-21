import type { RuleDefinition } from "../../read-config.js";
import { create_string_or_regexp_validator } from "../../validate_option.js";

// TODO: Deprecate this rule and instead add an ignore config to the "id-style" and "class-style" rules
const RULE_NAME = "id-class-ignore-regex";

export default {
  name: RULE_NAME,
  deprecate: true,
  deprecation_hint:
    "This is not a rule. It's a setting that will be used by real rules to ignore some HTML ids and CSS class based on their names.",
  validateConfig: create_string_or_regexp_validator(RULE_NAME, false),
  lint() {}
} as RuleDefinition;
