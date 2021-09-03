"use strict";
const kebabCase = require("kebabcase");
const chalk = require("chalk");
const EOL = require("os").EOL;

const buildAllowedOptions = (allowedOptions) => {
  let options = Object.keys(allowedOptions);

  options = options.reduce((opts, opt) => {
    const alias = allowedOptions[opt].alias;

    if (alias) {
      opts.push(alias);
    }

    return opts;
  }, options);
  options.sort();

  return options;
};

const cliOption = (opt) => opt.length === 1 ? `"-${opt}"` : `"--${kebabCase(opt)}"`;

const buildMessageLine = (invalid) => `Invalid option ${chalk.red(cliOption(invalid))}.${EOL}`;

module.exports = function checkInvalidCLIOptions(allowedOptions, inputOptions) {
  const allOptions = buildAllowedOptions(allowedOptions);
  return Object.keys(inputOptions)
    .map(opt => kebabCase(opt))
    .filter(opt => !allOptions.includes(opt))
    .reduce((msg, invalid) => {
      return msg + buildMessageLine(invalid);
    }, "");
};
