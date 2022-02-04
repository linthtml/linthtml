import {
  ActiveRuleDefinition,
  LegacyLinterConfig,
  LegacyRuleDefinition,
  LinterConfig,
  RuleConfig,
  RuleDefinition,
  LegacyRuleOption
} from "./read-config";

class NonExistingRule extends Error {
  constructor(public rule_name: string) {
    super(`Rule "${rule_name}" does not exist.`);
    this.name = "NonExistingRule";
    this.rule_name = rule_name;
  }
}

class InvalidRuleConfig extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidRuleConfig";
  }
}

function is_valid_string(str: string): boolean {
  return ["error", "warning", "off"].indexOf(str) !== -1;
}

// TODO: Create ENUM for severity?
function get_severity(config: any): "error" | "warning" {
  switch (typeof config) {
    case "boolean":
      return "error";
    case "string":
      return config as "error" | "warning";
    default:
      return get_severity(config[0]); // throw an error for objects?
  }
}

function should_active_rule(options: RuleConfig, ruleName: string): boolean {
  switch (typeof options) {
    case "boolean":
      return options;
    case "string":
      if (is_valid_string(options)) {
        return options !== "off";
      }
      throw new InvalidRuleConfig(`Invalid Config for rule "${ruleName}" - Unexpected string value "${options}"`);
    default:
      if (Array.isArray(options)) {
        return should_active_rule(options[0], ruleName);
      }
      throw new InvalidRuleConfig(
        `Invalid Config for rule "${ruleName}" - Unexpected value "${JSON.stringify(options)}"`
      );
  }
}

function extract_rule_config(config: RuleConfig, ruleName: string): unknown {
  if (typeof config !== "object") {
    return null;
  }
  if (Array.isArray(config) === false) {
    throw new InvalidRuleConfig(`Invalid Config for rule "${ruleName}"`); // todo: Create nice error
  }
  const ruleConfig = config[1];

  return ruleConfig;
}

function generate_rules_from_options(rule: LegacyRuleDefinition): {
  [rule_name: string]: RuleDefinition;
} {
  return rule.options.reduce((rules: { [rule_name: string]: RuleDefinition }, option: LegacyRuleOption) => {
    if (option.name) {
      rules[option.name] = {
        name: option.name,
        validateConfig: option.validateConfig,
        configTransform: option.configTransform,
        filter: option.filter,
        lint: option.lint || rule.lint // otherwise some "rules" won't be called
      };
    }
    return rules;
  }, {});
}
function extract_all_rules(rules: LegacyRuleDefinition[]) {
  const extracted_rules: Record<string, RuleDefinition> = rules.reduce(
    (extracted: Record<string, RuleDefinition>, rule) => {
      if (rule.options !== undefined) {
        const optionsRules = generate_rules_from_options(rule);
        extracted = { ...extracted, ...optionsRules };
      }
      extracted[rule.name] = rule;
      return extracted;
    },
    {}
  );

  delete extracted_rules.maxerr;
  // not considered as rules
  delete extracted_rules["text-ignore-regex"]; // display warning message for deprecation
  delete extracted_rules["raw-ignore-regex"];
  delete extracted_rules["attr-name-ignore-regex"];
  delete extracted_rules["id-class-ignore-regex"];
  delete extracted_rules["line-max-len-ignore-regex"];
  delete extracted_rules.ignoreFiles;
  return extracted_rules;
}

// TODO: Also validate config for "text-ignore-regex", "maxerr"...

export default class Config {
  public rules: Record<string, RuleDefinition>;
  public activated_rules: Record<string, ActiveRuleDefinition>; // Not good
  public config: LinterConfig;
  public legacy_config: LegacyLinterConfig = {};

  constructor(rules: LegacyRuleDefinition[] = [], config?: LinterConfig) {
    // TODO: Remove after v1. No more nested rules
    const plugins_rules = config?.plugins_rules ?? {};
    this.rules = { ...extract_all_rules(rules), ...plugins_rules };
    this.activated_rules = {};
    this.config = config as LinterConfig;
    if (this.config?.rules) {
      this.activateRules(this.config);
      // TODO: Remove after v1. No more needed
      this.legacy_config = this.generateLegacyConfig(this.config);
    }
  }

  /**
   * Activate rules from a config object
   */
  activateRules(config: LinterConfig) {
    const keys = Object.keys(config.rules as Record<string, RuleConfig>);
    keys.forEach((rule_name: string) => {
      const rule = this.getRule(rule_name);
      this.setRuleConfig(rule, config.rules as Record<string, RuleConfig>);
    });
  }

  /**
   * Get a rule by name.
   */
  getRule(rule_name: string): RuleDefinition | never {
    const rule = this.rules[rule_name];
    if (rule === undefined) {
      throw new NonExistingRule(rule_name);
    }
    return rule;
  }

  setRuleConfig(rule: RuleDefinition, rules_config: Record<string, RuleConfig>): void | never {
    if (should_active_rule(rules_config[rule.name], rule.name)) {
      let rule_config = extract_rule_config(rules_config[rule.name], rule.name);
      if (rule_config !== null && rule_config !== undefined) {
        rule_config = rule.configTransform ? rule.configTransform(rule_config) : rule_config;
        if (rule.validateConfig) {
          rule.validateConfig(rule_config);
        }
      }
      this.activated_rules[rule.name] = {
        ...rule,
        severity: get_severity(rules_config[rule.name]),
        config: rule_config
      };
    }
  }

  generateLegacyConfig(config: any): LegacyLinterConfig {
    const o: any = {};
    const keys = Object.keys(config.rules);
    keys.forEach((rule_name) => {
      const rule = this.getRule(rule_name);
      const newConfig = config.rules[rule_name];
      let rule_config = extract_rule_config(newConfig, rule_name);
      if (rule_config === null) {
        rule_config = newConfig;
      } else {
        rule_config = rule.configTransform ? rule.configTransform(rule_config) : rule_config;
      }
      o[rule_name] = rule_config;
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
