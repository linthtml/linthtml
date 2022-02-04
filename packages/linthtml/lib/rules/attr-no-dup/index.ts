import { reportFunction, RuleDefinition } from "../../read-config";
import { is_tag_node } from "@linthtml/dom-utils";
import { Node, NodeAttribute } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "attr-no-dup";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node)) {
    const attributes_map = new Map<string, NodeAttribute>();
    node.attributes.forEach((attribute) => {
      const name = attribute.name.chars.toLowerCase();
      if (attributes_map.has(name)) {
        report({
          code: "E003",
          position: (attributes_map.get(name) as NodeAttribute).loc,
          meta: {
            data: {
              attribute: name
            }
          }
        });
      } else {
        attributes_map.set(name, attribute);
      }
    });
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
