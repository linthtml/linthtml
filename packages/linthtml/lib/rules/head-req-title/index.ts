import { is_tag_node } from "@linthtml/dom-utils";
import { Element, Node } from "@linthtml/dom-utils/lib/dom_elements";
import { reportFunction, RuleDefinition } from "../../read-config";

const RULE_NAME = "head-req-title";

// TODO: Should return an error if title does not have a text node has a child
function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "head") {
    const titles = node.children.filter((child) => (child as Element).name === "title");
    const has_title_with_children = titles.some(({ children }) => children.length > 0);

    if (has_title_with_children === false) {
      report({
        code: "E027",
        position: node.open.loc
      });
    }
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
