import { is_void_node, is_tag_node } from "@linthtml/dom-utils";
import type { reportFunction, RuleDefinition } from "../../read-config.js";
import type { Node } from "@linthtml/dom-utils/dom_elements";

const RULE_NAME = "tag-close";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (!is_tag_node(node) || is_void_node(node)) {
    return;
  }
  const { name, close } = node;
  // If the tag did not close itself
  // remove toLowerCase
  if (!close || name.toLowerCase() !== close.chars.toLowerCase()) {
    report({
      code: "E042",
      position: node.open.loc
    });
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
