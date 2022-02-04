import { has_non_empty_attribute, is_comment_node, is_text_node, is_tag_node } from "@linthtml/dom-utils";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";
import { reportFunction, RuleDefinition } from "../../read-config";

const RULE_NAME = "button-req-content";

function has_text_content(node: Node): boolean {
  let result = false;
  if (is_comment_node(node)) {
    return result;
  }
  if (is_text_node(node)) {
    return node.data.trim().length > 0;
  }
  for (let i = 0; i < node.children.length; i++) {
    result = has_text_content(node.children[i]);
    if (result === true) {
      break;
    }
  }
  return result;
}

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "button") {
    if (has_text_content(node) === false && has_non_empty_attribute(node, "aria-label") === false) {
      report({
        code: "E061",
        position: node.open.loc
      });
    }
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
