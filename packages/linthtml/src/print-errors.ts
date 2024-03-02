import chalkTemplate from "chalk-template";
import * as messages from "@linthtml/core/messages";

export type CliError = { code?: string; meta?: Record<string, unknown>; message: string; fileName: string };

export default function print_errors(error: CliError) {
  if (error.code) {
    const [type, code] = error.code.split("-");
    const error_message = messages[`${type as "CORE"}_ERRORS`][code];
    return console.log(error_message(error.meta));
  }
  return console.log(chalkTemplate`{red ${error.message}}`);
}
