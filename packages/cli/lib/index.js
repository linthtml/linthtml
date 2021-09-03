/* eslint-disable no-console */
const fs = require("fs");
const chalk = require("chalk");
const ora = require("ora");
const meow = require("meow");

const checkInvalidCLIOptions = require("./check-invalid-cli-options");
const print_file_report = require("./print-file-report");
const init_command = require("./commands/init");
const print_config_command = require("./commands/print-config");
const printErrors = require("./print-errors");

const {
  displayBetaVersionMessage,
  exitProcess
} = require("./utils");

const linthtml = require("@linthtml/linthtml");
const { flatten } = require("@linthtml/linthtml/lib/utils/arrays");

const cliOptions = {
  help: chalk`
    Usage: linthtml [options] file.html [glob] [dir]

    {cyan.underline Configuration:}

      --config               Use this configuration, overriding .linthtmlrc config options if present

    {cyan.underline Output: }

      --color, --no--color  Force enabling/disabling of color

    {cyan.underline Miscellaneous:}

      --init                          Generate a default configuration file
      -h, --help                      Show help
      -v, --version                   Output the version number
      --print-config [path::String]   Print the configuration for the given file
  `,
  flags: {
    config: {
      type: "string",
      alias: "c"
    },
    color: { // no need to add `no-color` it"s automatic same for colorization too (no need to do anything)
      type: "boolean",
      default: true
    },
    printConfig: {
      type: "string"
    },
    init: {
      type: "boolean"
    },
    help: {
      alias: "h",
      type: "boolean"
    },
    version: {
      alias: "v",
      type: "boolean"
    }
  }
};

module.exports = (argv) => {
  cliOptions.argv = argv;
  const cli = meow(cliOptions);
  const invalidOptionsMessage = checkInvalidCLIOptions(cliOptions.flags, cli.flags);
  if (invalidOptionsMessage) {
    process.stderr.write(invalidOptionsMessage);
    return exitProcess();
  }

  // TODO: convert to command and throw deprecation warning for flag
  // Add format flag (json, yaml, rc) to command
  // Add legacy flag to command
  if (cli.flags.init) {
    return init_command()
      .then(exitProcess);
  }

  if (cli.flags.printConfig !== undefined) { // convert to command and throw deprecation warning for flag
    return print_config_command(cli.flags.printConfig);
  }

  // use config_path if provided or search local config file

  if (cli.flags.help || cli.flags.h || argv.length === 0) {
    cli.showHelp();
  }
  return lint(cli.input, cli.flags.config);
};

async function lint(input, config_path) {
  let files_linters = [];
  const searchSpinner = ora("Searching for files").start();
  try {
    files_linters = await linthtml.create_linters_for_files(input, config_path);
    searchSpinner.succeed(`Found ${files_linters.length} files`); // deal with 0
  } catch (error) {
    searchSpinner.fail();
    printErrors(error);
    exitProcess(true);
  }

  const lintSpinner = ora("Analysing files");
  try {
    lintSpinner.start();
    let reports = await Promise.all(files_linters.map(lintFile));
    reports = reports.filter(report => report.issues.length > 0);
    lintSpinner.succeed("Files analyzed");
    printReports(reports);
  } catch (error) {
    lintSpinner.fail();
    console.log();
    console.log(chalk`An error occured while analysing {underline ${error.fileName}}`);
    console.log();
    printErrors(error);
    console.log(chalk`{red ${error.message}}`);
    return exitProcess(true);
  }
}

function printReports(reports) {
  console.log();
  reports.forEach(print_file_report);

  if (reports.length > 0) {
    let issues = reports.filter((report) => report.issues.length > 0);
    issues = flatten(issues.map(_ => _.issues));
    const errorsCount = issues.reduce((count, issue) => issue.severity === "error" ? count + 1 : count, 0);
    const warningCount = issues.reduce((count, issue) => issue.severity === "warning" ? count + 1 : count, 0);
    const problemsCount = errorsCount + warningCount;
    if (errorsCount > 0) {
      console.log(chalk`{red ✖ ${problemsCount} ${problemsCount > 1 ? "problems" : "problem"} (${errorsCount} ${errorsCount > 1 ? "errors" : "error"}, ${warningCount} ${warningCount > 1 ? "warnings" : "warning"})}`);
      displayBetaVersionMessage();
      return exitProcess(true);
    }
    console.log(chalk`{yellow ✖ ${problemsCount} ${problemsCount > 1 ? "problems" : "problem"} (${errorsCount} ${errorsCount > 1 ? "errors" : "error"}, ${warningCount} ${warningCount > 1 ? "warnings" : "warning"})}`);
  } else {
    console.log("✨  There's no problem, good job 👏");
  }
  return exitProcess();
}

async function lintFile({ file_path, linter, config_path, preset }) {
  try {
    const file_content = fs.readFileSync(file_path, "utf8");
    const issues = await linter.lint(file_content);
    return {
      fileName: file_path,
      issues,
      config_path,
      preset
    };
  } catch (error) {
    error.fileName = file_path;
    throw error;
  }
}
