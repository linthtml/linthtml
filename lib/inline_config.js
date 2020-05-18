const CustomError = require("./utils/custom-errors");
// inline_config 0.1
//
// config "false", "off" disable rule
// Rest is treated as rule config

function is_string_config(str) {
  return /^("|')/.test(str) && /("|')$/.test(str);
}

function is_likely_inline_config(node) {
  if (node.type === "comment") {
    const data = node.data.trim();
    return new RegExp("^linthtml-").test(data);
  }
  return false;
}

function check_instruction(text) {
  const instruction = (/^linthtml-(\w+)(?:$|\s)/.exec(text))[1];
  if (instruction !== "configure") {
    throw new CustomError("INLINE_01", { instruction });
  }
}

function extract_rule_config(text) {
  const R = /((?:\s|)\w+[-\w]*=)/g;
  const matches = [];
  let match;
  while ((match = R.exec(text)) !== null) {
    matches.push(match);
  }
  return matches.reverse()
    .map(match => {
      const rule_name = match[0].replace("=", "").trim();
      const rule_configuration = text.slice(match.index).replace(match[0], "");
      text = text.slice(0, match.index);
      return {
        rule_name,
        rule_configuration
      };
    });
}

function get_instruction_meta(text, linter_config) {
  const instruction_meta = (/^linthtml-configure(?:\s+(.*)|$)/.exec(text))[1];
  if (instruction_meta !== undefined) {
    const rules_configurations = extract_rule_config(instruction_meta);

    return rules_configurations.reduce((configurations, { rule_name, rule_configuration }) => {
      // there's an extra pair of "|' for string configuration that need to be removed before using JSON.parse
      let cleaned_rule_configuration = rule_configuration.replace(/^("|')/, "").replace(/("|')$/, "");
      try {
        // deal with boolean, array and object
        cleaned_rule_configuration = JSON.parse(cleaned_rule_configuration);
      } catch (error) {
        if (is_string_config(rule_configuration) === false) {
          throw new CustomError("INLINE_03", { rule_configuration });
        }
      }
      try {
        const rule = linter_config.getRule(rule_name);

        if (cleaned_rule_configuration === false || cleaned_rule_configuration === "off") {
          configurations[rule_name] = {
            disabled: true
          };
        } else {
          cleaned_rule_configuration = rule.configTransform ? rule.configTransform(cleaned_rule_configuration) : cleaned_rule_configuration;
          if (rule.validateConfig) {
            rule.validateConfig(cleaned_rule_configuration);
          }
          configurations[rule_name] = {
            config: cleaned_rule_configuration
          };
        }
        return configurations;
      } catch ({ rule_name }) {
        throw new CustomError("INLINE_02", { rule_name });
      }
    }, {});
  }
}

/**
 *
 *
 * @param {*} node
 * @param {Config} linter_config
 * @param {*} report
 * @returns
 */
module.exports.extract_inline_config = function extract_inline_config(node, linter_config, report) {
  if (is_likely_inline_config(node) === false) {
    return {};
  }
  const data = node.data.trim();
  try {
    check_instruction(data);
    const instructions_meta = get_instruction_meta(data, linter_config);
    return instructions_meta;
  } catch (error) {
    report({
      code: error.code,
      position: node.lineCol,
      meta: {
        data: error.meta
      }
    });
  }
};
