import type { reportFunction, RuleDefinition } from "../../read-config.js";
import { is_tag_node, has_non_empty_attribute } from "@linthtml/dom-utils";
import type { Node } from "@linthtml/dom-utils/dom_elements";

const RULE_NAME = "html-req-lang";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "html") {
    if (has_non_empty_attribute(node, "lang") === false) {
      report({
        code: "E025",
        position: node.open.loc
      });
    }
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
