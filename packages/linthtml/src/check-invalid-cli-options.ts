import kebabCase from "lodash.kebabcase";
import chalk from "chalk";
import { EOL } from "os";
import type { AnyFlags } from "meow";

function buildAllowedOptions(allowedOptions: AnyFlags) {
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
}

function cliOption(opt: string) {
  return opt.length === 1 ? `"-${opt}"` : `"--${kebabCase(opt)}"`;
}

function buildMessageLine(invalid: string) {
  return `Invalid option ${chalk.red(cliOption(invalid))}.${EOL}`;
}

export default function checkInvalidCLIOptions(allowedOptions: AnyFlags, inputOptions: AnyFlags) {
  const allOptions = buildAllowedOptions(allowedOptions);
  return Object.keys(inputOptions)
    .filter((opt) => !allOptions.includes(opt))
    .reduce((msg, invalid) => {
      return msg + buildMessageLine(invalid);
    }, "");
}
