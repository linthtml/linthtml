import { is_boolean_attribute, is_tag_node, has_non_empty_attribute } from "@linthtml/dom-utils";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";
import { RuleDefinition, reportFunction } from "../../read-config";

const RULE_NAME = "attr-req-value";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node)) {
    // TODO: Remove after `raw-ignore-text` refacto
    const attributes = node.attributes.filter(({ name }) => /^¤+$/.test(name.chars) === false);
    attributes.forEach((attribute) => {
      const name = attribute.name.chars.toLowerCase();

      if (!has_non_empty_attribute(node, name) && !is_boolean_attribute(attribute)) {
        report({
          code: "E006",
          position: attribute.loc,
          meta: {
            data: {
              attribute: name
            }
          }
        });
      }
    });
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
