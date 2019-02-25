/* eslint-disable no-console */
const chalk = require("chalk");
const presets = require("./presets").presets;
const fs = require("fs");
const checkInvalidCLIOptions = require("./utils/checkInvalidCLIOptions");
const EXIT_CODE_ERROR = 2;
// const ora = require("ora");
// const pkg = require("../package.json");
const meow = require('meow');

const cliOptions = {
  help: `
    Usage: stylelint [options] file.html [file.html] [dir]

    ${chalk.cyan.underline('Configuration:')}

      -c, --c               Use this configuration, overriding .linthtmlrc config options if present

    ${chalk.cyan.underline('Output:')}

      --color, --no--color  Force enabling/disabling of color

    ${chalk.cyan.underline('Miscellaneous:')}

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
    color: {
      type: 'boolean',
      default: true
    },
    "no-color": {
      type: 'boolean',
      default: false
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

  if (cli.flags.help || cli.flags.h || argv.length === 0) {
    cli.showHelp(0);
    return;
  }
};
