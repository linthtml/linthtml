/* eslint-disable no-console */
import fs from "fs";
import chalkTemplate from "chalk-template";
import ora from "ora";
import type { AnyFlags, Options } from "meow";
import meow from "meow";

import type { Report } from "./utils.js";
import { exitProcess, EXIT_CODE_ERROR } from "./utils.js";

import checkInvalidCLIOptions from "./check-invalid-cli-options.js";
import print_file_report from "./print-file-report.js";
import init_command from "./commands/init.js";
import print_config_command from "./commands/print-config.js";
import type { CliError } from "./print-errors.js";
import printErrors from "./print-errors.js";

import linthtml from "@linthtml/core";
import type { LinterConfig, LegacyLinterConfig, FileLinter } from "@linthtml/core";
import type Issue from "@linthtml/core/issue";

const cliOptions = {
  help: chalkTemplate`
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
    color: {
      // no need to add `no-color` it"s automatic same for colorization too (no need to do anything)
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
    fix: {
      alias: "f",
      type: "boolean"
    },
    version: {
      alias: "v",
      type: "boolean"
    }
  },
  importMeta: import.meta
} satisfies Options<AnyFlags>;

export function cli(argv: string[]) {
  const cli = meow({ ...cliOptions, argv });
  const invalidOptionsMessage = checkInvalidCLIOptions(cliOptions.flags as AnyFlags, cli.flags as AnyFlags);
  if (invalidOptionsMessage) {
    process.stderr.write(invalidOptionsMessage);
    return exitProcess();
  }

  // TODO: convert to command and throw deprecation warning for flag
  // Add format flag (json, yaml, rc) to command
  // Add legacy flag to command
  if (cli.flags.init) {
    return init_command().then(() => exitProcess());
  }

  if (cli.flags.printConfig !== undefined) {
    // convert to command and throw deprecation warning for flag
    return print_config_command(cli.flags.printConfig);
  }

  // use config_path if provided or search local config file
  if (cli.flags.help || cli.flags.h || argv.length === 0) {
    cli.showHelp();
  }
  return lint(cli.input, cli.flags.config, cli.flags.fix);
}

async function lint(input: string[], config_path: string | undefined, fix?: boolean) {
  let files_linters = [];
  const searchSpinner = ora("Searching for files").start();
  try {
    files_linters = await linthtml.create_linters_for_files(input, config_path, fix);
    searchSpinner.succeed(`Found ${files_linters.length} files`); // deal with 0
  } catch (error) {
    searchSpinner.fail();
    printErrors(error as CliError);
    return exitProcess(EXIT_CODE_ERROR);
  }

  const lintSpinner = ora("Analyzing files");
  try {
    lintSpinner.start();
    let reports: Report[] = await Promise.all(files_linters.map(lintFile));
    // if (fix) {
    //   reports.forEach(({ fileName, dom }) => {
    //     // @ts-expect-error Fix types
    //     const html = render(dom);
    //     fs.writeFileSync(`${fileName}.new`, html);
    //   });
    // }
    reports = reports.filter((report) => report.issues.length > 0);
    lintSpinner.succeed("Files analyzed");
    printReports(reports);
  } catch (error) {
    lintSpinner.fail();
    console.log();
    console.log(chalkTemplate`An error occurred while analyzing {underline ${(error as CliError).fileName}}`);
    console.log();
    printErrors(error as CliError);
    // Needed after printErrors?
    console.log(chalkTemplate`{red ${(error as CliError).message}}`);
    return exitProcess(EXIT_CODE_ERROR);
  }
}

function printReports(reports: Report[]) {
  console.log("");
  reports.forEach(print_file_report);

  if (reports.length > 0) {
    const issues: Issue[] = reports
      .filter((report) => report.issues.length > 0)
      .reduce((acc: Issue[], { issues }) => [...acc, ...issues], []);

    const errorsCount = issues.reduce((count, issue) => (issue.severity === "error" ? count + 1 : count), 0);
    const warningCount = issues.reduce((count, issue) => (issue.severity === "warning" ? count + 1 : count), 0);
    const problemsCount = errorsCount + warningCount;

    if (errorsCount > 0) {
      console.log(
        chalkTemplate`{red ✖ ${problemsCount} ${problemsCount > 1 ? "problems" : "problem"} (${errorsCount} ${
          errorsCount > 1 ? "errors" : "error"
        }, ${warningCount} ${warningCount > 1 ? "warnings" : "warning"})}`
      );
      return exitProcess(EXIT_CODE_ERROR);
    }
    console.log(
      chalkTemplate`{yellow ✖ ${problemsCount} ${problemsCount > 1 ? "problems" : "problem"} (${errorsCount} ${
        errorsCount > 1 ? "errors" : "error"
      }, ${warningCount} ${warningCount > 1 ? "warnings" : "warning"})}`
    );
  } else {
    console.log("✨  There's no problem, good job 👏");
  }
  return exitProcess();
}

// TODO improve
async function lintFile({ file_path, linter, config_path, preset }: FileLinter): Promise<Report> | never {
  try {
    const file_content = fs.readFileSync(file_path, "utf8");
    const { dom, issues } = await linter.lint(file_content);
    return {
      fileName: file_path,
      issues,
      config_path,
      preset,
      dom
    };
  } catch (error) {
    (error as CliError).fileName = file_path;
    throw error;
  }
}

// TODO: Temp solution until packages split is "fixed"
export default linthtml;
export type Config = LinterConfig;
export type LegacyConfig = LegacyLinterConfig;
