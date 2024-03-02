import { chalkTemplateStderr } from "chalk-template";
import { exitProcess, EXIT_CODE_ERROR } from "../utils.js";
import { find_local_config } from "@linthtml/core";

export default function print_config(path: string) {
  if (path === "") {
    process.stderr.write(
      chalkTemplateStderr`A file path must be provided when using the {blue.bold print-config} option.`
    );
    exitProcess(EXIT_CODE_ERROR);
  }
  const config = find_local_config(path);
  if (config) {
    process.stdout.write(JSON.stringify(config.config, null, "  "));
    exitProcess();
  }
  process.stderr.write(chalkTemplateStderr`{red.bold Couldn't file a config file to print}`);
  exitProcess(EXIT_CODE_ERROR);
}
