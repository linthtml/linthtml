/*
 * Some options are used directly by the linter and do not control any
 * rules. Since we still want to process the values for these options
 * and generate documentation for them, we use a dummy rule which is
 * never called to contain them. It will be imported with the other
 * rules.
 */
const { stringOrRegexp } = require("../validate_option");
const { create_validation_for_numbers } = require("../validate_option");

module.exports = {
  name: "free-options",
  options: [
    {
      name: "maxerr",
      validateConfig: create_validation_for_numbers(false)
    },
    {
      name: "raw-ignore-regex",
      validateConfig: stringOrRegexp
    }
  ]
};

module.exports.options.forEach(function(option) {
  option.rules = [];
});
