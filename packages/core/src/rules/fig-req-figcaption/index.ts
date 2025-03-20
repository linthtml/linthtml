import { is_tag_node } from "@linthtml/dom-utils";
import type { Element, Node } from "@linthtml/dom-utils/dom_elements";
import type { reportFunction, RuleDefinition } from "../../read-config.js";

const RULE_NAME = "fig-req-figcaption";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node)) {
    if (node.name === "figure") {
      // get the children of this figure
      const children = node.children;
      const has_caption = children.find((child) => (child as Element).name === "figcaption");
      if (has_caption === undefined) {
        report({
          code: "E032",
          position: node.open.loc
        });
      }
    }
    if (node.name === "figcaption") {
      if (!node.parent || (node.parent as Element).name !== "figure") {
        report({
          code: "E032",
          position: node.open.loc,
          meta: {
            data: {
              hasMissingParent: true
            }
          }
        });
      }
    }
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
