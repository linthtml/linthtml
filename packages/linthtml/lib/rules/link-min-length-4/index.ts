import {
  is_tag_node,
  attribute_value,
  has_non_empty_attribute,
  is_comment_node,
  is_text_node
} from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "link-min-length-4";

function get_text_content(node: Node): string {
  if (is_comment_node(node)) {
    return "";
  }
  if (is_text_node(node)) {
    return node.data;
  }
  return node.children.reduce((content, child) => `${content}${get_text_content(child)}`, "");
}

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  // Will add a rule to enforce href attribute on link
  if (is_tag_node(node) && node.name === "a" && has_non_empty_attribute(node, "href")) {
    const content = get_text_content(node).trim();
    const aria_label = attribute_value(node, "aria-label")?.chars ?? "";

    // TODO: need to deal with aria-labelledby
    if (content.length < 4 && aria_label.length < 4) {
      report({
        code: "E059",
        position: node.open.loc,
        meta: {
          data: {
            content
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
