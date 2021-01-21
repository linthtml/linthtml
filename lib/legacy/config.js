/**
 * The config object stores all possible rules and options and manages
 * dependencies based on which options are enabled.
 * As it runs, it updates the subscribers array for each rule to indicate
 * the active rules and options depending on it.
 *
 * @module Config
 */
const { is_boolean } = require("../validate_option");
const pull = require("lodash.pull");

class Config {
  /**
   *
   * @constructor
   * @param {Object[]} rules - The rules to use.
   */
  constructor(rules) {
    /** @public */
    this.options = {};
    /** @public */
    this.rulesMap = {};
    if (rules) {
      rules.forEach(this.addRule.bind(this));
    }
  }

  /**
   * Get a rule by name.
   * @param {string} ruleName
   * @returns {Object}
   * @memberof Config
   */
  getRule(ruleName) {
    return this.rulesMap[ruleName];
  }

  /**
   * Add a rule.
   * @param {Object} rule
   * @param {string} rule.name
   * @param {string} [rule.on="dom"] - The rules called by rule.
   * @param {string[]} [rule.options] - Options to add with the rule.
   * Options in this list that have no name use the rule's name.
   * @memberof Config
   */
  addRule(rule) {
    if (["free-options", "dom"].indexOf(rule.name) === -1) {
      rule.on = "dom";
    }
    const oldRule = this.rulesMap[rule.name];
    if (rule === oldRule) {
      return;
    }

    rule.subscribers = [];
    this.rulesMap[rule.name] = rule;

    if (oldRule && oldRule.subscribers.length) {
      this.deactivateRule(oldRule);
      this.activateRule(rule);
      rule.subscribers = oldRule.subscribers;
    }

    if (rule.options) {
      rule.options.forEach((option) => {
        if (!option.name) {
          option.name = rule.name;
        }
        if (!option.rules) {
          option.rules = [rule.name];
        }
        this.addOption(option);
      });
    } else {
      this.addOption({
        name: rule.name,
        rules: [rule.name],
        validateConfig: rule.validateConfig || is_boolean
      });
    }
  }

  /**
   * Check if the provided string match an existing option
   *
   * @param {string} optionName
   * @memberof Config
   * @returns {Boolean}
   */
  hasOption(name) {
    return Boolean(this.options[name]);
  }

  /**
   * Remove a rule by name.
   * @param {string} ruleName
   * @memberof Config
   */
  removeRule(ruleName) {
    const rule = this.rulesMap[ruleName];
    if (rule) {
      this.deactivateRule(rule);
      delete this.rulesMap[ruleName];
    }
  }

  /**
   * Return a list of all rules.
   * @returns {Object[]}
   * @memberof Config
   */
  getAllRules() {
    return Object.values(this.rulesMap);
  }

  /**
   * Add an option.
   * @param {Object} option
   * @param {string} option.name
   * @param {string[]} [option.rules=[option.name]] - The rules using option.
   * @memberof Config
   */
  addOption(option) {
    const oldOption = this.options[option.name];
    if (option === oldOption) {
      return;
    }

    if (!option.rules) {
      option.rules = [option.name];
    }
    option.active = false;
    option.validateConfig = option.validateConfig || is_boolean;
    this.options[option.name] = option;

    if (oldOption && oldOption.active) {
      this.setOptionObj(oldOption, false);
      this.setOptionObj(option, true);
    }
  }

  /**
   * Remove an option by name.
   * @param {string} optionName
   * @memberof Config
   */
  removeOption(optionName) {
    const option = this.options[optionName];
    if (option) {
      this.setOptionObj(option, false);
      delete this.options[optionName];
    }
  }

  /**
   * Set the values of all options.
   * @param {Object} opts - Option values by name.
   * Values will be replaced with parsed versions.
   * @returns {Object[]} A list of issues
   * @memberof Config
   */
  initOptions(opts) {
    this.getAllRules()
      .forEach(function(rule) {
        rule.subscribers = [];
      });

    Object.values(this.options)
      .forEach(function(o) {
        o.active = false;
      });

    const issues = [];
    Object.keys(opts)
      .forEach((name) => {
        if (!(name in this.options)) {
          throw new Error(`Rule "${name}" does not exist`);
        }
        const value = opts[name];
        if (value !== false) {
          this.setOption(name, value);
        }
      });
    return issues;
  }

  /**
   * Set an option's value given the option name.
   * @param {string} optionName
   * @param value - The new value. Only its truthiness is used.
   * @returns The value, possibly parsed according to the option.
   * @memberof Config
   */
  setOption(optionName, value) {
    const rule = this.options[optionName];
    if (value !== false) {
      rule.validateConfig(value);
    }
    this.setOptionObj(rule, value);
    return value;
  }

  /**
   * Update rule subscriptions according to a new option value.
   * @param {Object} option
   * @param value - The new value. Only its truthiness is used.
   * @memberof Config
   */
  setOptionObj(option, value) {
    const active = value !== false && value !== undefined;
    if (active !== option.active) {
      this.onAllSubs(
        option,
        option.rules,
        (active ? this.addSubscriber : this.removeSubscriber).bind(this)
      );
      option.active = active;
    }
  }

  onAllSubs(obj, subs, action) {
    subs.forEach((parentName) => {
      if (this.rulesMap[parentName]) {
        action(this.rulesMap[parentName], obj);
      }
    });
  }

  activateRule(rule) {
    if (this.rulesMap[rule.on]) {
      this.addSubscriber(this.rulesMap[rule.on], rule);
    }
  }

  addSubscriber(rule, sub) {
    if (!rule.subscribers.length) {
      this.activateRule(rule);
    }
    rule.subscribers.push(sub);
  }

  deactivateRule(rule) {
    if (this.rulesMap[rule.on]) {
      this.removeSubscriber(this.rulesMap[rule.on], rule);
    }
  }

  removeSubscriber(rule, sub) {
    // I've try replacing pull with array.filter but it's not working
    if (!pull(rule.subscribers, sub).length) {
      this.deactivateRule(rule);
    }
  }
}

module.exports = Config;
