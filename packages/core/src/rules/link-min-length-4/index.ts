import type { ActiveRuleDefinition, reportFunction, RuleDefinition } from "../../read-config.js";
import type { Node } from "@linthtml/dom-utils/dom_elements";
import LinkLabelMinLengthRule from "../link-label-min-length/index.js";

const RULE_NAME = "link-min-length-4";

function lint(
  node: Node,
  _config: unknown,
  obj: {
    report: reportFunction;
    rules: Record<string, ActiveRuleDefinition>;
    global_config: Record<string, unknown>;
  }
) {
  return LinkLabelMinLengthRule.lint(node, 4, obj);
}

export default {
  name: RULE_NAME,
  deprecated: true,
  deprecation_hint: 'Use rule "link-label-min-length" instead.',
  lint
} as RuleDefinition;
