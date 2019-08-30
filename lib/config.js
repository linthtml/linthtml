class NonExistingRule extends Error {
  constructor(message) {
    super(message);
    this.name = "NonExistingRule";
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

function shouldActiveRule(options) {
  // throw an error
  switch(typeof options) {
    case 'boolean':
      return options;
    case 'string':
      return isValidString(options) && options !== 'off'; // throw an error for invalid string?
    default:
      return Array.isArray(options) && shouldActiveRule(options[0]); // throw an error for objects?
  }
}

function extractRuleConfig(config, ruleName) {
  if (typeof config !== 'object') {
    return null;
  }
  if (Array.isArray(config) === false) {
    throw new InvalidRuleConfig(`Invalid Config for rule "${ruleName}"`); // todo: Create nice error
  }
  let ruleConfig = config[1];
  
  // Should only be objects
  if (ruleConfig && (typeof ruleConfig !== 'object' || Array.isArray(ruleConfig) === true)) {
    throw new InvalidRuleConfig(`Invalid Config for rule "${ruleName}"`); // todo: Create nice error
  }
  return ruleConfig;
}

function extractAllRules(rules) {
  let o = {};
  let keys = Object.keys(rules);
  function genrateRulesFromOptions(rule) {
    let o = {};
    rule.options.forEach(option => {
      if (option.name) {
        o[option.name] = {
          name: option.name,
          need: rule.need,
          validateConfig: option.validateConfig,
          configTransform: option.configTransform,
          // lint: rule.lint
        };
      }
    });
    return o;
  }

  keys.forEach(key => {
    const rule = rules[key];
    if (rules[key].options) {
      let optionsRules = genrateRulesFromOptions(rules[key]);
      o = {...o, ...optionsRules};
    }
    o[rule.name] = rule;
  });

  delete o.maxerr;
  // not considered as rules
  delete o["spec-char-escape"]; // display warning message for deprecation
  delete o["text-ignore-regex"]; // display warning message for deprecation
  delete o["raw-ignore-regex"];
  return o;
}

/**
 * The config object stores all possible rules and options and manages
 * dependencies based on which options are enabled.
 * As it runs, it updates the subscribers array for each rule to indicate
 * the active rules and options depending on it.
 * @constructor
 * @param {Object[]} rules - The rules to use.
 * @param {Object[]} options - The options.
 */
class Config {
  constructor(rules = {}, config = {}) {
    
    // TODO: Remove after v1. No more nested rules
    this.rules = extractAllRules(rules);
    this.activatedRules = {};
    this.config = config;
    if (config.rules) {
      this.activateRules(this.config);
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
      this.setRuleConfig(rule, config);
    });
  }


  /**
   * A rule
   *
   * @typedef {Object} Rule
   * @property {string} name - Name of the rule.
   * @property {function} lint - The rule's lint function
   */

  /**
   * Get a rule by name.
   * @param {string} ruleName
   * @throws {NonExistingRule}
   * @returns {Rule}
   */
  getRule(ruleName) {
    const rule = this.rules[ruleName];
    if (rule === undefined) {
      throw new NonExistingRule(`Rule "${ruleName}" does not exist.`);
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
    if (shouldActiveRule(config[rule.name])) {
      let ruleConfig = extractRuleConfig(config[rule.name], rule.name);
      this.activatedRules[rule.name] = rule;
      if (ruleConfig) {
        ruleConfig = rule.configTransform ? rule.configTransform(ruleConfig) : ruleConfig;
        if (rule.validateConfig) {
          rule.validateConfig(ruleConfig);
        } 
      }
      // this.activateRules[ruleName] = Object.create(rule);
      this.activatedRules[rule.name].config = ruleConfig;
    }/* else {
      delete this.activateRules[rule.name];
    }*/ // ?
  }

  generateLegacyConfig(config) {
    let o = {};
    Object.keys(config.rules).forEach(ruleName => {
      let rule = this.getRule(ruleName);
      let newConfig = config.rules[ruleName];
      let ruleConfig = extractRuleConfig(newConfig, ruleName);
      if (ruleConfig === null) {
        ruleConfig = newConfig;
      } else {
        ruleConfig = rule.configTransform ? rule.configTransform(ruleConfig) : ruleConfig;
      }
      o[ruleName] = ruleConfig;
    });
    o.maxerr = config.maxerr;
    o["spec-char-escape"] = config["spec-char-escape"];
    o["text-ignore-regex"] = config["text-ignore-regex"];
    o["raw-ignore-regex"] = config["raw-ignore-regex"];
    return o;
  }
  
}

module.exports = Config;
