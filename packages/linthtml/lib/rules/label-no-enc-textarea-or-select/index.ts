import { is_tag_node } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "label-no-enc-textarea-or-select";

function find_select_textarea(node: Node): boolean {
  if (is_tag_node(node) && ["select", "textarea"].indexOf(node.name) !== -1) {
    return true;
  }
  return node.children ? node.children.some(find_select_textarea) : false;
}

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "label") {
    const has_nested_select = node.children.some(find_select_textarea);
    if (has_nested_select) {
      report({
        code: "E062",
        position: node.open.loc
      });
    }
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
