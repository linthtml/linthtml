import chalkTemplate from "chalk-template";
import type Issue from "@linthtml/core/issue";

import { createRequire } from "module";

const EXIT_CODE_ERROR = 1;
const EXIT_CODE_NORMAL = 0;

function isBetaVersion() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const packageJSON = createRequire(import.meta.url)("../package.json"); // Use this instead of import from to remove json import warning

  const { version } = packageJSON as { version: string };
  const R_BETA = /-(?:beta|alpha)\.\d+$/;
  return R_BETA.test(version);
}

function displayBetaVersionMessage() {
  if (isBetaVersion() === true) {
    console.log("");
    console.log(chalkTemplate`{yellow 🚧🚧 You"re using a beta version 🚧🚧}`);
    console.log(
      chalkTemplate`{yellow You might experiences some issues, please report any issues at {white https://github.com/linthtml/linthtml/issues 🙏}}`
    );
  }
}

function exitProcess(is_errored: typeof EXIT_CODE_ERROR | typeof EXIT_CODE_NORMAL = EXIT_CODE_NORMAL) {
  displayBetaVersionMessage();
  const exit_code = is_errored ? EXIT_CODE_ERROR : EXIT_CODE_NORMAL;
  return process.exit(exit_code);
}

type Report = {
  fileName: string;
  issues: Issue[];
  config_path?: string;
  preset?: string;
};

export { Report, isBetaVersion, displayBetaVersionMessage, exitProcess, EXIT_CODE_ERROR, EXIT_CODE_NORMAL };
