const chalk = require("chalk");
const errors = require("../messages");

module.exports = function(error) {
  if (error.code) {
    const [type, code] = error.code.split("-");
    const error_message = errors[`${type}_ERRORS`][code];
    return console.log(error_message(chalk, error.meta));
  }
  return console.log(chalk`{red ${error.message}}`);
};
