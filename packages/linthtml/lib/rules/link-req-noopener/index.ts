import { is_tag_node, attribute_has_value } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "link-req-noopener";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "a") {
    const noopen = /(^| )(noopener|noreferrer)( |$)/;

    if (attribute_has_value(node, "target", "_blank") && attribute_has_value(node, "rel", noopen) === false) {
      report({
        code: "E058",
        position: node.open.loc
      });
    }
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;

// <base target="_blank" />
// https://html.com/attributes/base-target/
