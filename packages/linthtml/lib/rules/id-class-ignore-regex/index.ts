import { create_string_or_regexp_validator } from "../../validate_option";

// TODO: Deprecate this rule and instead add an ignore config to the "id-style" and "class-style" rules
const RULE_NAME = "id-class-ignore-regex";

export default {
  name: RULE_NAME,
  validateConfig: create_string_or_regexp_validator(RULE_NAME, false),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  lint() {}
};
