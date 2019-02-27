/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const chalk = require("chalk");
// const ora = require("ora");
const cosmiconfig = require("cosmiconfig");
const meow = require('meow');

const presets = require("./presets").presets;
const checkInvalidCLIOptions = require("./utils/checkInvalidCLIOptions");

const explorer = cosmiconfig('linthtml', { stopDir: process.cwd()});
const EXIT_CODE_ERROR = 2;


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
      type: 'string',
      alias: 'c'
    },
    color: { // no nedd to add `no-color` it's automatic same for colorization too (no need to do anything)
      type: 'boolean',
      default: true
    },
    "print-config": {
      type: 'boolean'
    },
    init: {
      type: 'boolean'
    },
    help: {
      alias: "h",
      type: "boolean"
    }
  }
};

module.exports = (argv) => {
  cliOptions.argv = argv;
  const cli = meow(cliOptions);
  let globalConfig = null;
  const invalidOptionsMessage = checkInvalidCLIOptions(cliOptions.flags, cli.flags);

  if (invalidOptionsMessage) {
    process.stderr.write(invalidOptionsMessage);
    process.exit(EXIT_CODE_ERROR); // eslint-disable-line no-process-exit
  }
  if (cli.flags.init) {
    const defaultConfig = Object.keys(presets.default).map(key => `  ${key}: ${JSON.stringify(presets.default[key])}`).join(',\n');
    fs.writeFileSync(".linthtmlrc", `{\n${defaultConfig}\n}`, "utf8");
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
          // config = cosmiconfig('linthtml', { stopDir: p.dir }).searchSync(p.dir);
          config = explorer.loadSync(configPath);
        } else {
          config = cosmiconfig('linthtml', { searchPlaces: [p.base], stopDir: p.dir }).searchSync(p.dir);
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
  if (cli.flags.printConfig) {
    let config = globalConfig.config? globalConfig.config : globalConfig;
    process.stdout.write(JSON.stringify(config, null, "  "));
  }

  if (cli.flags.help || cli.flags.h || argv.length === 0) {
    cli.showHelp(0);
    return;
  }
};
