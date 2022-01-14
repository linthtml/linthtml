import { RuleDefinition } from "../../read-config";
import { create_string_or_regexp_validator } from "../../validate_option";

const RULE_NAME = "attr-name-ignore-regex";

export default {
  name: RULE_NAME,
  validateConfig: create_string_or_regexp_validator(RULE_NAME),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  lint() {}
} as RuleDefinition;
