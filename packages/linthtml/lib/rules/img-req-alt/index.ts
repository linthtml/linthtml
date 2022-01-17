import { reportFunction, RuleDefinition } from "../../read-config";
import { is_tag_node, has_non_empty_attribute } from "@linthtml/dom-utils";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "img-req-alt";

function validateConfig(option: unknown) {
  if (typeof option === "string" && option !== "allownull") {
    throw new Error(`Configuration for rule "${RULE_NAME}" is invalid: Only "allownull" is accepted as string value`);
  }

  if (typeof option !== "boolean" && typeof option !== "string") {
    throw new Error(`Configuration for rule "${RULE_NAME}" is invalid: Expected boolean got ${typeof option}`);
  }

  return option;
}

function lint(node: Node, config: string, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "img") {
    if (has_non_empty_attribute(node, "alt", config === "allownull") === false) {
      report({
        code: "E013",
        position: node.open.loc
      });
    }
  }
}

export default {
  name: RULE_NAME,
  validateConfig,
  lint
} as RuleDefinition;
