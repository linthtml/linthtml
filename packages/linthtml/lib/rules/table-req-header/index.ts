import { is_tag_node } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";
import { Element, Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "table-req-header";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "table") {
    const children = node.children;
    let childIndex = 0;
    let child;

    // ffwd to first rnodevant table child
    while (
      (child = children[childIndex]) &&
      (!is_tag_node(child) || // skip text nodes
        child.name.match(/(caption|colgroup)/i))
    ) {
      childIndex++;
    }

    if (child?.name?.match(/thead/i)) {
      return;
    }

    if (child?.name?.match(/tr/i)) {
      // Check if any child in first row is `<th>`, not just first child (which could be a text node)
      for (let i = 0, l = child.children.length; i < l; i++) {
        if ((child.children[i] as Element)?.name === "th") {
          return;
        }
      }
    }

    report({
      code: "E035",
      position: node.open.loc
    });
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
