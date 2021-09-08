const chalk = require("chalk");
const pkg = require("../package.json");

const EXIT_CODE_ERROR = 1;
const EXIT_CODE_NORMAL = 0;

function isBetaVersion() {
  const { version } = pkg;
  const R_BETA = /-(?:beta|alpha)\.\d+$/;
  return R_BETA.test(version);
}

function displayBetaVersionMessage() {
  if (isBetaVersion() === true) {
    console.log();
    console.log(chalk`{yellow 🚧🚧 You"re using a beta version 🚧🚧}`);
    console.log(chalk`{yellow You might experiences some issues, please report any issues at {white https://github.com/linthtml/linthtml/issues 🙏}}`);
  }
}

function exitProcess(is_errored = false) {
  displayBetaVersionMessage();
  const exit_code = is_errored ? EXIT_CODE_ERROR : EXIT_CODE_NORMAL;
  return process.exit(exit_code);
}

module.exports = {
  isBetaVersion,
  displayBetaVersionMessage,
  exitProcess,
  EXIT_CODE_ERROR,
  EXIT_CODE_NORMAL
};
