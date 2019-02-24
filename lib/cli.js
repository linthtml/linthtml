/* eslint-disable no-console */
const chalk = require("chalk");
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
    }
  }
};

module.exports = (argv) => {
  cliOptions.argv = argv;
  const cli = meow(cliOptions);
  
};
