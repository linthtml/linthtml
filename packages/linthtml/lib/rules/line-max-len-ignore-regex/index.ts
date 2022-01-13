const { create_string_or_regexp_validator } = require("../../validate_option");

const RULE_NAME = "line-max-len-ignore-regex";

export default {
  name: RULE_NAME,
  validateConfig: create_string_or_regexp_validator(RULE_NAME),
  lint() {}
};
