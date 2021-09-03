const lintClassStyle = require("../class-style").lint;
const lintIdStyle = require("../id-style").lint;
const {
  create_list_value_validator
} = require("../../validate_option");

// TODO: Deprecate this rule
const RULE_NAME = "id-class-style";

function lint(node, config, { report, rules, global_config }) {
  if (Boolean(rules["id-style"]) === false && rules["id-class-style"]) {
    lintIdStyle(node, global_config["id-class-style"], { report, rules, global_config });
  }
  if (Boolean(rules["class-style"]) === false && rules["id-class-style"]) {
    lintClassStyle(node, global_config["id-class-style"], { report, rules, global_config });
  }
}

module.exports = {
  name: RULE_NAME,
  validateConfig: create_list_value_validator(["lowercase", "underscore", "dash", "camel", "bem"]),
  lint
};
