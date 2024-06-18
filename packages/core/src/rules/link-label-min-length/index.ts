import {
  is_tag_node,
  attribute_value,
  has_non_empty_attribute,
  is_comment_node,
  is_text_node
} from "@linthtml/dom-utils";
import type { reportFunction, RuleDefinition } from "../../read-config.js";
import type { Node } from "@linthtml/dom-utils/dom_elements";
import { create_number_validator } from "../../validate_option.js";

const RULE_NAME = "link-label-min-length";

function get_text_content(node: Node): string {
  if (is_comment_node(node)) {
    return "";
  }
  if (is_text_node(node)) {
    return node.data;
  }
  return node.children.reduce((content, child) => `${content}${get_text_content(child)}`, "");
}

function lint(node: Node, min_length: number, { report }: { report: reportFunction }) {
  // Will add a rule to enforce href attribute on link
  if (is_tag_node(node) && node.name === "a" && has_non_empty_attribute(node, "href")) {
    const content = get_text_content(node).trim();
    const aria_label = attribute_value(node, "aria-label")?.chars ?? "";
    // TODO: need to deal with aria-labelledby
    if (content.length < min_length && aria_label.length < min_length) {
      report({
        code: "E059",
        position: node.open.loc,
        meta: {
          data: {
            content,
            min_length
          }
        }
      });
    }
  }
}

export default {
  name: RULE_NAME,
  validateConfig: create_number_validator(RULE_NAME, false),
  lint
} as RuleDefinition;
