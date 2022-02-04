import { is_tag_node } from "@linthtml/dom-utils";
import { Element, Node } from "@linthtml/dom-utils/lib/dom_elements";
import { reportFunction, RuleDefinition } from "../../read-config";

const RULE_NAME = "html-valid-content-model";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "html") {
    let has_head = false;
    let has_body = false;

    node.children
      .filter((child) => child.type === "tag")
      .forEach((child) => {
        // E044: Illegal element
        // E045: Duplicated tag
        // E046: Head and body tags out of order
        // TODO: Clean
        let err;
        if ((child as Element).name === "head") {
          err = has_body ? "E046" : has_head ? "E045" : undefined;
          has_head = true;
        } else if ((child as Element).name === "body") {
          err = has_body ? "E045" : undefined;
          has_body = true;
        } else {
          err = "E044";
        }
        if (err) {
          report({
            code: err,
            position: child.open.loc
          });
        }
      });
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
