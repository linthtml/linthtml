/* eslint-disable no-console */
const fs = require("fs");
const globby = require("globby");
const chalk = require("chalk");
const ora = require("ora");
const meow = require("meow");
const linthtml = require("../index");

const { config_from_path, find_local_config } = require("./read-config");
const printErrors = require("./print-errors");
const presets = require("../presets").presets;
const checkInvalidCLIOptions = require("../utils/checkInvalidCliOptions");
const printFileReport = require("../printFileReport");

const { flatten } = require("../utils/arrays");

const EXIT_CODE_ERROR = 1;
const EXIT_CODE_NORMAL = 0;

const pkg = require("../../package.json");

const excludedFolders = [
  "!node_modules/",
  "!.git/",
  "!temp/",
  "!.tmp/"
];

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
    color: { // no nedd to add `no-color` it"s automatic same for colorization too (no need to do anything)
      type: "boolean",
      default: true
    },
    "print-config": {
      type: "boolean"
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
  let config = null;
  if (invalidOptionsMessage) {
    process.stderr.write(invalidOptionsMessage);
    return exitProcess();
  }

  if (cli.flags.init) {
    fs.writeFileSync(".linthtmlrc", JSON.stringify(presets.default, null, "\t"), "utf8");
    console.log(chalk`Successfully created {blue .linthtmlrc} file in {underline ${process.cwd()}}`);
    return exitProcess();
  }

  if (cli.flags.config !== undefined) {
    if (cli.flags.config === "") {
      console.log(chalk`A file path must be provided when using the {blue.bold config} option.`);
      process.exit(EXIT_CODE_ERROR); // eslint-disable-line no-process-exit
    } else {
      try {
        config = config_from_path(cli.flags.config);
      } catch (error) {
        printErrors(error);
        return exitProcess(true);
      }
    }
  }

  if (config === null) {
    config = find_local_config();
  }
  if (config === null) {
    config = presets.default;
  }

  config = config.config ? config.config : config;

  if (cli.flags.printConfig) {
    process.stdout.write(JSON.stringify(config, null, "  "));
  }

  if (cli.flags.help || cli.flags.h || argv.length === 0) {
    cli.showHelp();
  }
  return lint(cli.input, config);
};

function exitProcess(is_errored = false) {
  displayBetaVersionMessage();
  const exit_code = is_errored ? EXIT_CODE_ERROR : EXIT_CODE_NORMAL;
  return process.exit(exit_code);
}

async function getLinter(config) {
  const configSpinner = ora("Checking rules config").start();
  try {
    const linter = await linthtml.fromConfig(config);
    configSpinner.succeed();
    return linter;
  } catch (error) {
    configSpinner.fail();
    console.log();
    console.error(chalk`{red ${error.message}}`);
    return exitProcess(true);
  }
}

async function lint(input, config) {
  const linter = await getLinter(config);

  const searchSpinner = ora("Searching for files").start();
  const lintSpinner = ora("Analysing files").start();
  let files = await getFilesToLint(input);
  searchSpinner.succeed(`Found ${files.length} files`);
  files = files.map(getFileContent);
  try {
    let reports = await Promise.all(files.map(file => lintFile(file, linter, config)));
    reports = reports.filter(report => report.issues.length > 0);
    lintSpinner.succeed();
    printReports(reports);
  } catch (error) {
    lintSpinner.fail();
    console.log();
    console.log(chalk`An error occured while analysing {underline ${error.fileName}}`);
    console.log();
    console.log(chalk`{red ${error.message}}`);
    return exitProcess(true);
  }
}

function printReports(reports) {
  console.log();
  reports.forEach(printFileReport);

  if (reports.length > 0) {
    let issues = reports.filter((report) => report.issues.length > 0);
    issues = flatten(issues.map(_ => _.issues));
    const errorsCount = issues.reduce((count, issue) => issue.severity === "error" ? count + 1 : count, 0);
    const warningCount = issues.reduce((count, issue) => issue.severity === "warning" ? count + 1 : count, 0);
    const problemsCount = errorsCount + warningCount;
    if (errorsCount > 0) {
      console.log(chalk`{red ✖ ${problemsCount} ${problemsCount > 1 ? "problems" : "problem"} (${errorsCount} ${errorsCount > 1 ? "errors" : "error"}, ${warningCount} ${warningCount > 1 ? "warnings" : "warning"})}`);
      displayBetaVersionMessage();
      return process.exit(EXIT_CODE_ERROR);
    }
    console.log(chalk`{yellow ✖ ${problemsCount} ${problemsCount > 1 ? "problems" : "problem"} (${errorsCount} ${errorsCount > 1 ? "errors" : "error"}, ${warningCount} ${warningCount > 1 ? "warnings" : "warning"})}`);
  } else {
    console.log("✨  There's no problem, good job 👏");
  }
  return exitProcess();
}

function getFilesFromGlob(globPattern) {
  // const patterns = excludedFolders.concat(globPattern);
  return globby(globPattern, {
    gitignore: true,
    ignore: excludedFolders,
    expandDirectories: {
      files: ["**/*.html"],
      extensions: ["html"]
    }
  });
}

function getFilesToLint(input) {
  return Promise.all(input.map(getFilesFromGlob))
    .then(flatten);
}

function getFileContent(name) {
  return {
    name,
    content: fs.readFileSync(name).toString("utf8")
  };
}

async function lintFile(file, linter, config) {
  try {
    const issues = await linter.lint(file.content, config);
    return { fileName: file.name, issues };
  } catch (error) {
    error.fileName = file.name;
    throw error;
  }
}

function isBetaVersion() {
  const { version } = pkg;
  const R_BETA = /-beta\.\d+$/;
  return R_BETA.test(version);
}

function displayBetaVersionMessage() {
  if (isBetaVersion() === true) {
    console.log();
    console.log(chalk`{yellow 🚧🚧 You"re using a beta version 🚧🚧}`);
    console.log(chalk`{yellow You might experiences some issues, please report any issues at {white https://github.com/linthtml/linthtml/issues 🙏}}`);
  }
}
