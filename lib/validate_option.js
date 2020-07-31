/* eslint-disable-next-line */
const { isRegExp } = require("util");

function list_value_error_message(value_list) {
  const list_copy = [...value_list];
  if (value_list.length > 1) {
    const last_value = list_copy.pop();
    return `Accepted values are ${list_copy.map(_ => `"${_}"`).join(", ")} and "${last_value}"`;
  }
  return `Accepted value is ${list_copy[0]}`;
}

// TODO: Create error code for messages
module.exports = {
  isBool: function(option) {
    if (typeof option !== "boolean") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected boolean got ${typeof option}.`);
    }
    return option;
  },

  stringOrRegexp(format) {
    if (typeof format === "string" || isRegExp(format) === true) {
      return format;
    }
    throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string or RegExp got ${typeof format}.`);
  },
  create_string_or_regexp_validator(allow_empty = true) {
    return function(option) {
      if ((typeof option === "string" && (allow_empty || option !== "")) || isRegExp(option) === true) {
        return option;
      }
      if (!allow_empty && typeof option === "string") {
        throw new Error(`Configuration for rule "${this.name}" is invalid: You provide an empty string value.`);
      }
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string or RegExp got ${typeof option}.`);
    };
  },
  create_list_value_validator(value_list, allow_reg = true) {
    const type_error = (rule_name, option) => `Configuration for rule "${rule_name}" is invalid: Expected string${allow_reg ? "|regexp" : ""} got ${typeof option}.`;
    if (Array.isArray(value_list) === false) {
      // create error core
      throw new Error("You must provide a array of string");
    }
    // TODO: need same rule without regexp
    return function(option) {
      if (typeof option !== "string" && (allow_reg === false || isRegExp(option) === false)) {
        throw new Error(type_error(this.name, option));
      }

      if (value_list.indexOf(option) === -1 && isRegExp(option) === false) {
        // TODO: need same rule without regexp
        throw new Error(`Configuration for rule "${this.name}" is invalid: "${option}" is not accepted. ${list_value_error_message(value_list)}.`);
      }
      return option;
    };
  },

  create_validation_for_numbers(allow_neg = true) {
    return function(option) {
      if (typeof option !== "number") {
        throw new Error(`Configuration for rule "${this.name}" is invalid: Expected number got ${typeof option}.`);
      }
      if (allow_neg === false && option < 0) {
        throw new Error(`Configuration for rule "${this.name}" is invalid: Only positive indent value are allowed.`);
      }
      return option;
    };
  }
};
