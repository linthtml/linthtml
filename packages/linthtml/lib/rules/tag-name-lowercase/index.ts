import { is_tag_node } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "tag-name-lowercase";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && /[A-Z]/.test(node.open.chars)) {
    report({
      code: "E017",
      position: node.open.loc,
      meta: {
        data: {
          name: node.name
        }
      }
    });
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
