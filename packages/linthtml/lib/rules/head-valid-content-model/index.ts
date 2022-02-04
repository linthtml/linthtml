import { is_tag_node } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "head-valid-content-model";

const legal_children = ["base", "link", "meta", "noscript", "script", "style", "template", "title"];

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "head") {
    node.children
      .filter((child) => is_tag_node(child) && legal_children.indexOf(child.name) < 0)
      .forEach((child) =>
        report({
          code: "E047",
          position: child.open.loc
        })
      );
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
