import chalk from "chalk";
import * as messages from "./messages";

export default function print_errors(error: { code: string; meta: unknown; message: string }) {
  if (error.code) {
    const [type, code] = error.code.split("-");
    // @ts-ignore
    const error_message = messages[`${type}_ERRORS`][code];
    return console.log(chalk`{red Error:} ${error_message(error.meta)}`);
  }
  return console.log(chalk`{red ${error.message}}`);
}
