import { is_tag_node } from "@linthtml/dom-utils";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";
import { reportFunction, RuleDefinition } from "../../read-config";

const RULE_NAME = "title-no-dup";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "head") {
    const titles = node.children.filter((child) => is_tag_node(child) && child.name === "title");

    if (titles.length > 1) {
      titles.slice(1).forEach((title) =>
        report({
          code: "E028",
          position: title.open.loc,
          meta: {
            data: {
              num: titles.length
            }
          }
        })
      );
    }
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
