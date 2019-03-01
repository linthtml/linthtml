/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const globby = require("globby");
const chalk = require("chalk");
const ora = require("ora");
const cosmiconfig = require("cosmiconfig");
const meow = require("meow");
const linthtml = require("./index");

const presets = require("./presets").presets;
const checkInvalidCLIOptions = require("./utils/checkInvalidCLIOptions");
const printFileReport = require("./printFileReport");

const explorer = cosmiconfig("linthtml", { stopDir: process.cwd()});
const EXIT_CODE_ERROR = 2;

let globalConfig = null;

const excludedFolders = [
  "!node_modules",
  "!.git",
  "!temp",
  "!.tmp"
];

function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

const cliOptions = {
  help: chalk`
    Usage: stylelint [options] file.html [file.html] [dir]

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

  if (invalidOptionsMessage) {
    process.stderr.write(invalidOptionsMessage);
    process.exit(EXIT_CODE_ERROR); // eslint-disable-line no-process-exit
  }
  if (cli.flags.init) {
    fs.writeFileSync(".linthtmlrc", JSON.stringify(presets.default, null, "\t"), "utf8");
    return;
  }

  if (cli.flags.config) {
    if (cli.flags.config === "") {
      process.stderr.write(`A file path must be provided when using the ${chalk.red.bold(`config`)} option`);
      process.exit(EXIT_CODE_ERROR); // eslint-disable-line no-process-exit
    } else {
      const configPath = path.join(process.cwd(), cli.flags.config);
      let isConfigDirectory = false;
      try {
        let config = null;
        isConfigDirectory = fs.lstatSync(configPath).isDirectory();
        const p = path.parse(configPath);
        if (isConfigDirectory) {
          // config = cosmiconfig("linthtml", { stopDir: p.dir }).searchSync(p.dir);
          config = explorer.loadSync(configPath);
        } else {
          config = cosmiconfig("linthtml", { searchPlaces: [p.base], stopDir: p.dir }).searchSync(p.dir);
        }
        if (config === null) {
          throw new Error();
        }
        globalConfig = config;
      } catch (error) {
        if (isConfigDirectory) {
          console.log(`${chalk.red("Error:")} Cannot read config file in directory: ${chalk.underline(configPath)}`);
        } else {
          console.log(`${chalk.red("Error:")} Cannot read config file: ${chalk.underline(configPath)}`);
        }
        process.exit(EXIT_CODE_ERROR); // eslint-disable-line no-process-exit
      }
    }
  }

  if (globalConfig === null) {
    globalConfig = explorer.searchSync();
  }
  if (globalConfig === null) {
    globalConfig = presets.default;
  }

  globalConfig = globalConfig.config? globalConfig.config : globalConfig;

  if (cli.flags.printConfig) {
    process.stdout.write(JSON.stringify(globalConfig, null, "  "));
  }

  if (cli.flags.version || cli.flags.v) {
    cli.showVersion();

    return;
  }

  if (cli.flags.help || cli.flags.h || argv.length === 0) {
    cli.showHelp(0);
    return;
  }

  return lint(cli.input);
};

function lint(input) {
  let searchSpinner = ora("Searching for files").start();
  let lintSpinner;
  return getFilesToLint(input)
    .then(files => {
      searchSpinner.succeed(`Found ${files.length} files`);
      lintSpinner = ora("Analysing files").start();
      return files.map(getFileContent);
    })
    .then(files => {
      const promises = files.map(lintFile);
      return Promise.all(promises);
      // return reports.filter(report => report.issues.length > 0);
    })
    .then(reports => reports.filter(report => report.issues.length > 0))
    .then(reports => {
      lintSpinner.succeed();
      console.log();
      reports.forEach(printFileReport);

      if (reports.length > 0) {
        const errorsCount = reports.reduce((count, report) => count + report.issues.length, 0);
        console.log(chalk`{red ✖ ${errorsCount} ${errorsCount > 1 ? "errors" : "error"}}`);
      } else {
        console.log("✨  There's no error, good job 👏");
      }
    });
}

function getFilesFromGlob(globPattern) {
  const patterns = excludedFolders.concat(globPattern);
  return globby(patterns, {
    gitignore: true,
    expandDirectories: {
      files: ["**/*.html"],
      extensions: ["html"]
    }
  });
}
function getFilesToLint(input) {
  let promises = input.map(getFilesFromGlob);
  return Promise.all(promises)
            .then(flatten);
}

function getFileContent(name) {
  return {
    name,
    content: fs.readFileSync(name).toString("utf8")
  };
}

function lintFile(file) {
  return linthtml(file.content, globalConfig).
            then(issues => Object({ fileName:file.name, issues }));
}
