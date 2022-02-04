import { is_tag_node, has_attribute, has_non_empty_attribute, attribute_value } from "@linthtml/dom-utils";
import { Element, Node } from "@linthtml/dom-utils/lib/dom_elements";
import { reportFunction, RuleDefinition } from "../../read-config";

const RULE_NAME = "focusable-tabindex-style";

function is_linkable(node: Element) {
  const isLink = ["a", "area"].indexOf(node.name) !== -1;
  return isLink ? has_attribute(node, "href") : false;
}

function is_focusable_node(node: Element) {
  const isFocusableNatively = ["button", "input", "select", "textarea"].indexOf(node.name) !== -1;

  return isFocusableNatively || is_linkable(node) || has_non_empty_attribute(node, "tabindex");
}

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && is_focusable_node(node) && has_attribute(node, "disabled") === false) {
    const tabindex = attribute_value(node, "tabindex");
    if (tabindex && parseInt(tabindex.chars, 10) > 0) {
      report({
        code: "E026",
        position: node.open.loc,
        meta: {
          data: {
            tabindex: parseInt(tabindex.chars, 10)
          }
        }
      });
    }
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
