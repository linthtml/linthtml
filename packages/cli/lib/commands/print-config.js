const chalk = require("chalk");
const { exitProcess, EXIT_CODE_ERROR } = require("../utils");
const { find_local_config } = require("@linthtml/linthtml/lib/read-config");

module.exports = function(path) {
  if (path === "") {
    console.log(chalk`A file path must be provided when using the {blue.bold print-config} option.`);
    exitProcess(EXIT_CODE_ERROR);
  }
  const config = find_local_config(path);
  if (config) {
    process.stdout.write(JSON.stringify(config.config, null, "  "));
    exitProcess();
  }
  console.log(chalk`{red.bold Couldn't file a config file to print}`);
  exitProcess(EXIT_CODE_ERROR);
};
