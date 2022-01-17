import { is_tag_node } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "tag-name-match";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node)) {
    const { name, open, close } = node;
    // If the tag did not close itself
    // remove toLowerCase
    if (!close || name.toLowerCase() !== close.chars.toLowerCase()) {
      return;
    }

    if (open.chars !== close.chars) {
      report({
        code: "E030",
        position: close.loc,
        meta: {
          data: {
            open
          }
        }
      });
    }
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
