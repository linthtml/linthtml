import { is_tag_node } from "@linthtml/dom-utils";
import type { Element, Node } from "@linthtml/dom-utils/dom_elements";
import type { reportFunction, RuleDefinition } from "../../read-config.js";

const RULE_NAME = "title-no-dup";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "head") {
    const titles = node.children.filter((child): child is Element => is_tag_node(child) && child.name === "title");

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
