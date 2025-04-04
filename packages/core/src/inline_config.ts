import { is_comment_node } from "@linthtml/dom-utils";
import CustomError from "./utils/custom-errors.js";
import type { Comment, Node } from "@linthtml/dom-utils/dom_elements";
import type Config from "./config.js";
import type { NonExistingRule } from "./config.js";
import type { reportFunction } from "./read-config.js";
// inline_config 0.2
//
// config "false", "off" disable rule
// Rest is treated as rule config

export interface InlineInstructionConfig {
  config?: unknown;
  disabled?: boolean;
}

export interface InlineConfig {
  [rule_name: string]: InlineInstructionConfig;
}

function is_string_config(str: string): boolean {
  return /^("|')/.test(str) && /("|')$/.test(str);
}

// TODO: return node is CommentNode instead

/**
 * Check whether or not an HTML is a inline config node
 */
function is_likely_inline_config(node: Node): boolean {
  if (is_comment_node(node)) {
    const data = node.data.trim();
    return /^linthtml-/.test(data);
  }
  return false;
}

/**
 * Validate that inline config contains a valid inline instruction
 */
function check_instruction(text: string): void | never {
  const instruction = (/^linthtml-(\w+)(?:$|\s)/.exec(text) as RegExpExecArray)[1];
  const instruction_types = ["configure", "enable", "disable"];
  if (instruction_types.indexOf(instruction) === -1) {
    throw new CustomError("INLINE_01", { instruction });
  }
}

// don't catch things like `rule rule_2="x"` (rule_2 extracted but not rule)
// don't catch things like `my/rule="x"` (rule extracted but not my/rule)
// ' x=y - ' => extract config "y -" should be y only
function extract_rule_config(text: string): { rule_name: string; rule_configuration: string }[] {
  const R = /((?:\s|)\w+[-//\w]*=)/g;
  const matches = [];
  let match;
  while ((match = R.exec(text)) !== null) {
    matches.push(match);
  }
  return matches.reverse().map((match) => {
    const rule_name = match[0].replace("=", "").trim();
    const rule_configuration = text.slice(match.index).replace(match[0], "");
    text = text.slice(0, match.index);
    return {
      rule_name,
      rule_configuration
    };
  });
}

function parse_config(rule_configuration: string): boolean | string | Array<unknown> | Record<string, unknown> | never {
  const cleaned_rule_configuration = rule_configuration.replace(/^("|')/, "").replace(/("|')$/, "");
  try {
    // deal with boolean, array and object
    return JSON.parse(cleaned_rule_configuration) as boolean | string | Array<unknown> | Record<string, unknown>;
  } catch (_error) {
    if (is_string_config(rule_configuration) === false) {
      throw new CustomError("INLINE_03", { rule_configuration });
    }
    return cleaned_rule_configuration;
  }
}

function generate_inline_instruction(
  rule_name: string,
  rule_configuration: boolean | string | Array<unknown> | Record<string, unknown>,
  linter_config: Config
): InlineInstructionConfig {
  let rule;
  try {
    rule = linter_config.getRule(rule_name);
  } catch (error) {
    throw new CustomError("INLINE_02", { rule_name: (error as NonExistingRule).rule_name });
  }
  if (typeof rule_configuration === "boolean" || rule_configuration === "off") {
    return {
      disabled: rule_configuration === "off" ? true : !rule_configuration
    };
  }
  try {
    rule_configuration = rule.configTransform
      ? (rule.configTransform(rule_configuration) as string | Array<unknown> | Record<string, unknown>)
      : rule_configuration;
    if (rule.validateConfig) {
      rule.validateConfig(rule_configuration, false);
    }
    return {
      config: rule_configuration
    };
  } catch (error) {
    throw new CustomError("INLINE_04", { rule_name, error: (error as Error).message });
  }
}

function get_instruction_meta(text: string, linter_config: Config): InlineConfig {
  const [, instruction_type, instruction_meta] = /^linthtml-(enable|disable|configure)(?:\s+(.*)|$)/.exec(
    text
  ) as RegExpExecArray;

  if (instruction_type === "configure") {
    const rules_configurations = instruction_meta
      ? extract_rule_config(instruction_meta) // report error if only rule_name and nothing else
      : [];
    return rules_configurations.reduce((configurations: InlineConfig, { rule_name, rule_configuration }) => {
      // there's an extra pair of "|' for string configuration that need to be removed before using JSON.parse
      const cleaned_rule_configuration = parse_config(rule_configuration);
      configurations[rule_name] = generate_inline_instruction(rule_name, cleaned_rule_configuration, linter_config);
      return configurations;
    }, {});
  }

  const rules = instruction_meta
    ? instruction_meta.trim().split(/\s*,\s*/)
    : Object.keys(linter_config.activated_rules); // If no rules provided then enable/disabled all activated rules
  return rules.reduce((configurations: InlineConfig, rule_name) => {
    configurations[rule_name] = generate_inline_instruction(rule_name, instruction_type === "enable", linter_config);
    return configurations;
  }, {});
}

/**
 * Extract inline config from HTML comment node
 */
export function extract_inline_config(node: Node, linter_config: Config, report: reportFunction): InlineConfig {
  if (is_likely_inline_config(node) === false) {
    return {};
  }
  const data = (node as Comment).data.trim();
  try {
    check_instruction(data);
    return get_instruction_meta(data, linter_config);
  } catch (error) {
    report({
      code: (error as CustomError).code,
      position: node.loc,
      meta: {
        data: (error as CustomError).meta
      }
    });
    return {};
  }
}
