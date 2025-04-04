import { is_tag_node, is_text_node } from "@linthtml/dom-utils";
import { create_number_validator } from "../../validate_option.js";
import type { reportFunction, RuleDefinition } from "../../read-config.js";
import type { Node } from "@linthtml/dom-utils/dom_elements";

const RULE_NAME = "title-max-len";

// TODO: check what happen if empty config/add default value?
function lint(node: Node, max_length: number, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "title") {
    const text = node.children
      .filter((child) => is_text_node(child))
      .map((child) => child.data)
      .join("");
    if (text.length > max_length) {
      report({
        code: "E029",
        position: node.open.loc,
        meta: {
          data: {
            title: text,
            max_length
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
