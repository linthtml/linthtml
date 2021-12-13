class NonExistingRule extends Error {
  constructor(rule_name) {
    super(`Rule "${rule_name}" does not exist.`);
    this.name = "NonExistingRule";
    this.rule_name = rule_name;
  }
}

class InvalidRuleConfig extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidRuleConfig";
  }
}

function isValidString(str) {
  return ["error", "warning", "off"].indexOf(str) !== -1;
}

/**
 * @param {RuleActivationConfig} config
 * @returns {("error"|"warning")}
 */
function getSeverity(config) {
  switch (typeof config) {
    case "boolean":
      return "error";
    case "string":
      return config;
    default:
      return getSeverity(config[0]); // throw an error for objects?
  }
}

/**
 * @param {RuleActivationConfig} options
 * @param {String} ruleName
 * @returns {Boolean}
 */
function shouldActiveRule(options, ruleName) {
  switch (typeof options) {
    case "boolean":
      return options;
    case "string":
      if (isValidString(options)) {
        return options !== "off";
      }
      throw new InvalidRuleConfig(`Invalid Config for rule "${ruleName}" - Unexpected string value "${options}"`);
    default:
      if (Array.isArray(options)) {
        return shouldActiveRule(options[0], ruleName);
      }
      throw new InvalidRuleConfig(`Invalid Config for rule "${ruleName}" - Unexpected value "${JSON.stringify(options)}"`);
  }
}

/**
 * @param {RuleActivationConfig} config
 * @param {String} ruleName
 * @returns {Object}
 */
function extractRuleConfig(config, ruleName) {
  if (typeof config !== "object") {
    return null;
  }
  if (Array.isArray(config) === false) {
    throw new InvalidRuleConfig(`Invalid Config for rule "${ruleName}"`); // todo: Create nice error
  }
  const ruleConfig = config[1];

  return ruleConfig;
}

function generate_rules_from_options(rule) {
  const o = {};
  rule.options.forEach(option => {
    if (option.name) {
      o[option.name] = {
        name: option.name,
        validateConfig: option.validateConfig,
        configTransform: option.configTransform,
        filter: option.filter,
        lint: option.lint || rule.lint // otherwise some "rules" won't be called
      };
    }
  });
  return o;
}

function extractAllRules(rules, config) {
  let o = {};
  const keys = Object.keys(rules);

  keys.forEach(key => {
    const rule = rules[key];
    if (rules[key].options) {
      const optionsRules = generate_rules_from_options(rules[key]);
      o = { ...o, ...optionsRules };
    }
    o[rule.name] = rule;
  });

  delete o.maxerr;
  // not considered as rules
  delete o["text-ignore-regex"]; // display warning message for deprecation
  delete o["raw-ignore-regex"];
  delete o["attr-name-ignore-regex"];
  delete o["id-class-ignore-regex"];
  delete o["line-max-len-ignore-regex"];
  /* eslint-disable-next-line dot-notation */
  delete o["ignoreFiles"];
  return o;
}

/**
 * @typedef {(Boolean|"error"|"warning"|"off"|String[])} RuleActivationConfig
 */

/**
 * A rule
 *
 * @typedef {object} Rule
 * @property {string} name - Name of the rule.
 * @property {function} lint - The rule's lint function
 * @property {function} [configTransform]
 * @property {function} [validateConfig]
 */

/**
 * @class Config
 */
class Config {
  /**
   * @constructor
   * @param {Object} rules -
   * @param {Object} config -
   */
  constructor(rules = {}, config = {}) {
    // TODO: Remove after v1. No more nested rules
    const { plugins_rules = [] } = config;
    this.rules = { ...extractAllRules(rules), ...plugins_rules };
    this.activatedRules = {};
    this.config = config;
    if (config.rules) {
      this.activateRules(this.config);
      // TODO: Remove after v1. No more needed
      this.legacy_config = this.generateLegacyConfig(this.config);
    }
  }

  /**
   * Activate rules from a config object
   * @param {*} config
   */
  activateRules(config) {
    const keys = Object.keys(config.rules);
    keys.forEach(ruleName => {
      const rule = this.getRule(ruleName);
      this.setRuleConfig(rule, config.rules);
    });
  }

  /**
   * Get a rule by name.
   * @param {string} ruleName
   * @throws {NonExistingRule}
   * @returns {Rule}
   */
  getRule(ruleName) {
    const rule = this.rules[ruleName];
    if (rule === undefined) {
      throw new NonExistingRule(ruleName);
    }
    return rule;
  }

  /**
   * Configure a rule from a config object
   *
   * @param {Rule} rule
   * @param {object} config
   * @throws {InvalidRuleConfig}
   */
  setRuleConfig(rule, config) {
    if (shouldActiveRule(config[rule.name], rule.name)) {
      let ruleConfig = extractRuleConfig(config[rule.name], rule.name);
      this.activatedRules[rule.name] = rule;
      if (ruleConfig !== null && ruleConfig !== undefined) {
        ruleConfig = rule.configTransform ? rule.configTransform(ruleConfig) : ruleConfig;
        if (rule.validateConfig) {
          rule.validateConfig(ruleConfig);
        }
      }
      this.activatedRules[rule.name].severity = getSeverity(config[rule.name]);
      this.activatedRules[rule.name].config = ruleConfig;
    }
  }

  generateLegacyConfig(config) {
    const o = {};
    Object.keys(config.rules).forEach(ruleName => {
      const rule = this.getRule(ruleName);
      const newConfig = config.rules[ruleName];
      let ruleConfig = extractRuleConfig(newConfig, ruleName);
      if (ruleConfig === null) {
        ruleConfig = newConfig;
      } else {
        ruleConfig = rule.configTransform ? rule.configTransform(ruleConfig) : ruleConfig;
      }
      o[ruleName] = ruleConfig;
    });
    o.maxerr = config.maxerr;
    o["text-ignore-regex"] = config["text-ignore-regex"];
    o["raw-ignore-regex"] = config["raw-ignore-regex"];
    o["attr-name-ignore-regex"] = config["attr-name-ignore-regex"];
    o["id-class-ignore-regex"] = config["id-class-ignore-regex"];
    o["line-max-len-ignore-regex"] = config["line-max-len-ignore-regex"];
    return o;
  }
}

module.exports = Config;
