import { is_void_node, is_tag_node, is_self_closing } from "@linthtml/dom-utils";
import { create_list_value_validator } from "../../validate_option";
import { reportFunction, RuleDefinition } from "../../read-config";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "tag-self-close";

function lint(node: Node, style: "always" | "never", { report }: { report: reportFunction }) {
  if (!is_tag_node(node) || is_void_node(node) === false) {
    return;
  }
  const { name, close } = node;
  // If the tag did not close itself
  // remove toLowerCase
  if (!close || name.toLowerCase() !== close.chars.toLowerCase()) {
    const selfClose = is_self_closing(node);
    if ((style === "always" && !selfClose) || (style === "never" && selfClose)) {
      report({
        code: "E018",
        position: node.open.loc,
        meta: {
          data: {
            expect: style
          }
        }
      });
    }
  }
}

export default {
  name: RULE_NAME,
  validateConfig: create_list_value_validator(RULE_NAME, ["always", "never"], false),
  lint
} as RuleDefinition;
