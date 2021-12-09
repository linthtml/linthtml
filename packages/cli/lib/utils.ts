import chalk from "chalk";
import pkg from "../package.json";
//@ts-ignore
import { Range } from '@linthtml/dom-utils/dist/lib/dom_elements'

const EXIT_CODE_ERROR = 1;
const EXIT_CODE_NORMAL = 0;

function isBetaVersion() {
  const { version } = pkg;
  const R_BETA = /-(?:beta|alpha)\.\d+$/;
  return R_BETA.test(version);
}

function displayBetaVersionMessage() {
  if (isBetaVersion() === true) {
    process.stdout.write("");
    process.stdout.write(chalk`{yellow 🚧🚧 You"re using a beta version 🚧🚧}`);
    process.stdout.write(chalk`{yellow You might experiences some issues, please report any issues at {white https://github.com/linthtml/linthtml/issues 🙏}}`);
  }
}

function exitProcess(is_errored: typeof EXIT_CODE_ERROR | typeof EXIT_CODE_NORMAL = EXIT_CODE_NORMAL) {
  displayBetaVersionMessage();
  const exit_code = is_errored ? EXIT_CODE_ERROR : EXIT_CODE_NORMAL;
  return process.exit(exit_code);
}

// TODO: Global type or import from `@linthtml/linthtml`
type Issue = {
  severity: 'warning' | 'error';
  position: Range;
  code: string;
  rule: string;
  data: Object;
  message: string;
}

type Report = {
  fileName: string;
  issues: Issue[];
  config_path: string;
  preset: string;
}


export {
  Issue,
  Report,
  isBetaVersion,
  displayBetaVersionMessage,
  exitProcess,
  EXIT_CODE_ERROR,
  EXIT_CODE_NORMAL
};
