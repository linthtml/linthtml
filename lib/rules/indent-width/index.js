const { create_number_validator } = require("../../validate_option");
const indent_lint = require("../indent-style/index").lint;

const RULE_NAME = "indent-width";

function lint(_, __, { rules }) {
  if (Boolean(rules["indent-style"]) === false) {
    return indent_lint(...arguments);
  }
}

module.exports = {
  name: RULE_NAME,
  validateConfig: create_number_validator(false),
  lint
};
