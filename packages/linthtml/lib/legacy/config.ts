import { is_boolean } from "../validate_option";
import pull from "lodash.pull";
import { LegacyRuleDefinition, LegacyRuleOption } from "../read-config";

/**
 * The config object stores all possible rules and options and manages
 * dependencies based on which options are enabled.
 * As it runs, it updates the subscribers array for each rule to indicate
 * the active rules and options depending on it.
 */
export default class Config {
  public options: { [key: string]: LegacyRuleOption };
  public rulesMap: { [key: string]: LegacyRuleDefinition };
  constructor(rules: LegacyRuleDefinition[]) {
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
   */
  getRule(ruleName: string): LegacyRuleDefinition {
    // Template type for rule name?
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
  addRule(rule: LegacyRuleDefinition) {
    if (["free-options", "dom"].indexOf(rule.name) === -1) {
      rule.on = "dom";
    }
    const oldRule = this.rulesMap[rule.name];
    if (rule === oldRule) {
      return;
    }

    rule.subscribers = [];
    this.rulesMap[rule.name] = rule;

    if (oldRule?.subscribers.length) {
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
        validateConfig: rule.validateConfig || is_boolean(rule.name)
      });
    }
  }

  /**
   * Check if the provided string match an existing option
   */
  hasOption(name: string) {
    return Boolean(this.options[name]);
  }

  /**
   * Remove a rule by name.
   */
  removeRule(ruleName: string) {
    const rule = this.rulesMap[ruleName];
    if (rule) {
      this.deactivateRule(rule);
      delete this.rulesMap[ruleName];
    }
  }

  /**
   * Return a list of all rules.
   */
  getAllRules() {
    return Object.values(this.rulesMap);
  }

  /**
   * Add an option.
   */
  addOption(option: LegacyRuleOption) {
    const oldOption = this.options[option.name];
    if (option === oldOption) {
      return;
    }

    if (!option.rules) {
      option.rules = [option.name];
    }
    option.active = false;
    option.validateConfig = option.validateConfig || is_boolean(option.name);
    this.options[option.name] = option;

    if (oldOption && oldOption.active) {
      this.setOptionObj(oldOption, false);
      this.setOptionObj(option, true);
    }
  }

  /**
   * Remove an option by name.
   */
  removeOption(optionName: string) {
    const option = this.options[optionName];
    if (option) {
      this.setOptionObj(option, false);
      delete this.options[optionName];
    }
  }

  /**
   * Set the values of all options.
   * Values will be replaced with parsed versions.
   */
  initOptions(opts: Record<string, unknown>) {
    this.getAllRules().forEach(function (rule) {
      rule.subscribers = [];
    });

    Object.values(this.options).forEach(function (o) {
      o.active = false;
    });

    Object.keys(opts).forEach((name) => {
      if (!(name in this.options)) {
        throw new Error(`Rule "${name}" does not exist`);
      }
      const value = opts[name];
      if (value !== false) {
        this.setOption(name, value);
      }
    });
  }

  /**
   * Set an option's value given the option name.
   * @param {string} optionName
   * @param value - The new value. Only its truthiness is used.
   * @returns The value, possibly parsed according to the option.
   * @memberof Config
   */
  setOption(optionName: string, value: unknown) {
    const rule = this.options[optionName];
    if (value !== false) {
      rule.validateConfig?.(value);
    }
    this.setOptionObj(rule, value);
    return value;
  }

  /**
   * Update rule subscriptions according to a new option value.
   */
  setOptionObj(option: LegacyRuleOption, value: unknown) {
    const active = value !== false && value !== undefined;
    if (active !== option.active) {
      this.onAllSubs(option, option.rules, (active ? this.addSubscriber : this.removeSubscriber).bind(this));
      option.active = active;
    }
  }

  onAllSubs(
    obj: LegacyRuleOption,
    subs: string[],
    action: (rule: LegacyRuleDefinition, sub: LegacyRuleOption | LegacyRuleDefinition) => void
  ) {
    subs.forEach((parentName) => {
      if (this.rulesMap[parentName]) {
        action(this.rulesMap[parentName], obj);
      }
    });
  }

  activateRule(rule: LegacyRuleDefinition) {
    if (this.rulesMap[rule.on]) {
      this.addSubscriber(this.rulesMap[rule.on], rule);
    }
  }

  addSubscriber(rule: LegacyRuleDefinition, sub: LegacyRuleOption | LegacyRuleDefinition) {
    if (!rule.subscribers.length) {
      this.activateRule(rule);
    }
    rule.subscribers.push(sub as LegacyRuleDefinition);
  }

  deactivateRule(rule: LegacyRuleDefinition) {
    if (this.rulesMap[rule.on]) {
      this.removeSubscriber(this.rulesMap[rule.on], rule);
    }
  }

  removeSubscriber(rule: LegacyRuleDefinition, sub: LegacyRuleOption | LegacyRuleDefinition) {
    // I've try replacing pull with array.filter but it's not working
    if (!pull(rule.subscribers, sub).length) {
      this.deactivateRule(rule);
    }
  }
}
