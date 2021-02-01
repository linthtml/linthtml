const { create_string_or_regexp_validator } = require("../../validate_option");

const RULE_NAME = "attr-name-ignore-regex";

module.exports = {
  name: RULE_NAME,
  validateConfig: create_string_or_regexp_validator(),
  lint() {}
};
