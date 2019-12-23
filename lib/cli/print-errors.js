const chalk = require("chalk");
const errors = require("../messages");

module.exports = function(error) {
  let [type, code] = error.code.split("-");

  let error_message = errors[`${type}_ERRORS`][code];
  console.log(error_message(chalk, error.meta));
}
