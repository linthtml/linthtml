const chalk = require("chalk");
const errors = require("../messages");

module.exports = function(error) {
  const [type, code] = error.code.split("-");

  const error_message = errors[`${type}_ERRORS`][code];
  console.log(error_message(chalk, error.meta));
};
