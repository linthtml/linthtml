import { types } from "node:util";
const { isRegExp } = types;

// TODO: Use generic for functions?

export function get_config_type(config: unknown) {
  if (config === null) {
    return "null";
  }

  const type = typeof config;

  if (type !== "object") {
    return type;
  }

  if (Array.isArray(config)) {
    return "array";
  }

  if (isRegExp(config)) {
    return "regexp";
  }

  return type;
}

export function is_object(config: unknown): config is Record<string, unknown> {
  return get_config_type(config) === "object";
}

// TODO: Send `rule_name` to the actual validation function?
// TODO: Create error code for messages
export function is_boolean(rule_name: string) {
  return function (option: unknown): boolean | never {
    if (typeof option !== "boolean") {
      throw new Error(
        `Configuration for rule "${rule_name}" is invalid: Expected boolean got ${get_config_type(option)}.`
      );
    }
    return option;
  };
}

export function create_string_or_regexp_validator(rule_name: string, allow_empty_string = true) {
  return function (option: unknown): string | RegExp | never {
    if ((typeof option === "string" && (allow_empty_string || option !== "")) || isRegExp(option) === true) {
      return option;
    }
    if (!allow_empty_string && typeof option === "string") {
      throw new Error(`Configuration for rule "${rule_name}" is invalid: You provide an empty string value.`);
    }
    throw new Error(
      `Configuration for rule "${rule_name}" is invalid: Expected string or RegExp got ${get_config_type(option)}.`
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

// @ts-expect-error No working in TS 5 - TO FIX (use Template type ?)
export function create_list_value_validator(
  rule_name: string,
  values: string[],
  allow_reg?: true
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
): never | ((option: unknown) => option is string | RegExp | never);
export function create_list_value_validator(
  rule_name: string,
  values: string[],
  allow_reg: false
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
): never | ((option: unknown) => option is string | never);
export function create_list_value_validator(rule_name: string, values: string[], allow_reg = true) {
  const type_error = (rule_name: string, option: unknown) =>
    `Configuration for rule "${rule_name}" is invalid: Expected string${
      allow_reg ? " or RegExp" : ""
    } got ${get_config_type(option)}.`;
  if (Array.isArray(values) === false || values.some((_) => typeof _ !== "string")) {
    throw new Error("You must provide a array of string"); // CORE error message?
  }
  // TODO: need same rule without regexp
  return function (option: unknown) {
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
      throw new Error(
        `Configuration for rule "${rule_name}" is invalid: Expected number got ${get_config_type(option)}.`
      );
    }
    if (allow_neg === false && option < 0) {
      throw new Error(`Configuration for rule "${rule_name}" is invalid: Only positive indent value are allowed.`);
    }
    return option;
  };
}

export function create_object_validator(rule_name: string, object_keys: string[]) {
  return function (option: unknown): Record<string, unknown> | never {
    if (!is_object(option)) {
      throw new Error(
        `Configuration for rule "${rule_name}" is invalid: Expected object got ${get_config_type(option)}.`
      );
    }

    const invalid_key = Object.keys(option).find((key) => !["format", "ignore"].includes(key));

    if (invalid_key) {
      throw new Error(
        `Object configuration for rule "${rule_name}" is invalid: key "${invalid_key}" is not accepted, only "${object_keys.join('", "')}" ${object_keys.length > 1 ? "are" : "is"}.`
      );
    }

    return option;
  };
}

export function run_validation_for_option_key(
  validation_fn: <T>(option: T, is_legacy?: boolean) => void | never,
  key: string
) {
  return function (option: Record<string, unknown>) {
    try {
      validation_fn(option[key]);
    } catch (error) {
      const error_message = (error as Error).message
        .replace("Configuration for", "Object configuration for")
        .replace(":", `: Setting "${key}" is not valid:`);
      throw error_message;
    }
  };
}
