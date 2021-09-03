const { create_string_or_regexp_validator } = require("../../validate_option");

// TODO: Deprecate this rule and instead add an ignore config to the "id-style" and "class-style" rules
const RULE_NAME = "id-class-ignore-regex";

module.exports = {
  name: RULE_NAME,
  validateConfig: create_string_or_regexp_validator(false),
  lint() {}
};
