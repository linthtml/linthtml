// REMOVE
/*
 * Some options are used directly by the linter and do not control any
 * rules. Since we still want to process the values for these options
 * and generate documentation for them, we use a dummy rule which is
 * never called to contain them. It will be imported with the other
 * rules.
 */
import { create_number_validator, create_string_or_regexp_validator } from "../validate_option";
// TODO: can be removed?
export default {
  name: "free-options",
  options: [
    {
      name: "maxerr",
      validateConfig: create_number_validator("maxerr", false),
      rules: []
    },
    {
      name: "raw-ignore-regex",
      validateConfig: create_string_or_regexp_validator("raw-ignore-regex"),
      rules: []
    }
  ]
};
