import { types } from "util";
const { isRegExp } = types;

// TODO: Send `rule_name` to the actual validation function?
// TODO: Create error code for messages
export function is_boolean(rule_name: string) {
  return function (option: unknown): boolean | never {
    if (typeof option !== "boolean") {
      throw new Error(`Configuration for rule "${rule_name}" is invalid: Expected boolean got ${typeof option}.`);
    }
    return option;
  };
}

export function create_string_or_regexp_validator(rule_name: string, allow_empty_string = true) {
  return function (option: any): string | RegExp | never {
    if ((typeof option === "string" && (allow_empty_string || option !== "")) || isRegExp(option) === true) {
      return option;
    }
    if (!allow_empty_string && typeof option === "string") {
      throw new Error(`Configuration for rule "${rule_name}" is invalid: You provide an empty string value.`);
    }
    throw new Error(
      `Configuration for rule "${rule_name}" is invalid: Expected string or RegExp got ${typeof option}.`
    );
  };
}
function list_value_error_message(value_list: string[]): string {
  const list_copy = [...value_list];
  if (value_list.length > 1) {
    const last_value = list_copy.pop();
    return `Accepted values are ${list_copy.map((_) => `"${_}"`).join(", ")} and "${last_value}"`;
  }
  return `Accepted value is ${list_copy[0]}`;
}

export function create_list_value_validator(
  rule_name: string,
  values: string[],
  allow_reg?: true
): (option: any) => option is (string | RegExp) | never;
export function create_list_value_validator(
  rule_name: string,
  values: string[],
  allow_reg: false
): (option: any) => option is string | never;
export function create_list_value_validator(rule_name: string, values: string[], allow_reg = true) {
  const type_error = (rule_name: string, option: unknown) =>
    `Configuration for rule "${rule_name}" is invalid: Expected string${
      allow_reg ? " or RegExp" : ""
    } got ${typeof option}.`;
  if (Array.isArray(values) === false || values.some((_) => typeof _ !== "string")) {
    throw new Error("You must provide a array of string"); // CORE error message?
  }
  // TODO: need same rule without regexp
  return function (option: any) {
    if (typeof option !== "string" && (allow_reg === false || isRegExp(option) === false)) {
      throw new Error(type_error(rule_name, option));
    }

    if (values.indexOf(option as string) === -1 && isRegExp(option) === false) {
      throw new Error(
        `Configuration for rule "${rule_name}" is invalid: "${option}" is not accepted. ${list_value_error_message(
          values
        )}.`
      );
    }

    return option;
  };
}

export function create_number_validator(rule_name: string, allow_neg = true) {
  return function (option: unknown): number | never {
    if (typeof option !== "number") {
      throw new Error(`Configuration for rule "${rule_name}" is invalid: Expected number got ${typeof option}.`);
    }
    if (allow_neg === false && option < 0) {
      throw new Error(`Configuration for rule "${rule_name}" is invalid: Only positive indent value are allowed.`);
    }
    return option;
  };
}
