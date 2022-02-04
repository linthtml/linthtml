import { reportFunction, RuleDefinition } from "../../read-config";
import { is_tag_node } from "@linthtml/dom-utils";
import { Element, Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "fieldset-contains-legend";

function lint(element: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(element) && element.name === "fieldset") {
    const has_legend = element.children.some((node) => (node as Element).name === "legend");

    if (has_legend === false) {
      report({
        code: "E063",
        position: element.open.loc
      });
    }
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
