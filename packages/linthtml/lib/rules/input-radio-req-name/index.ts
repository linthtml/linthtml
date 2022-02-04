import { reportFunction, RuleDefinition } from "../../read-config";
import { is_tag_node, has_non_empty_attribute, attribute_has_value } from "@linthtml/dom-utils";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "input-radio-req-name";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "input") {
    // if it's not a radio-type input, ignore it
    if (attribute_has_value(node, "type", "radio") && has_non_empty_attribute(node, "name") === false) {
      report({
        code: "E034",
        position: node.open.loc
      });
    }
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
