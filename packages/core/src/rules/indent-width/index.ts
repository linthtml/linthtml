import type { ActiveRuleDefinition, RuleDefinition, reportFunction } from "../../read-config.js";
import { create_number_validator } from "../../validate_option.js";
import IndentStyleRule from "../indent-style/index.js";
import type { Node } from "@linthtml/dom-utils/dom_elements";

const RULE_NAME = "indent-width";

function lint(
  node: Node,
  config: unknown,
  obj: {
    report: reportFunction;
    rules: Record<string, ActiveRuleDefinition>;
    global_config: Record<string, unknown>;
  }
) {
  if (Boolean(obj.rules["indent-style"]) === false) {
    return IndentStyleRule.lint(node, config, obj);
  }
}

export default {
  name: RULE_NAME,
  validateConfig: create_number_validator(RULE_NAME, false),
  lint
} as RuleDefinition;
