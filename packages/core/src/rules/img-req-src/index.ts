import { is_tag_node, has_non_empty_attribute } from "@linthtml/dom-utils";
import type { Node } from "@linthtml/dom-utils/dom_elements";
import type { reportFunction, RuleDefinition } from "../../read-config.js";

const RULE_NAME = "img-req-src";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "img") {
    if (has_non_empty_attribute(node, "src") === false) {
      report({
        code: "E014",
        position: node.open.loc
      });
    }
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
