import { is_tag_node, has_attribute, has_non_empty_attribute } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "tag-req-attr";

function validateConfig(options: unknown) {
  if (typeof options !== "object") {
    throw new Error(`Configuration for rule "${RULE_NAME}" is invalid: Expected object got ${typeof options}`);
  }
  return options;
}
// TODO: Cleanup config validation
function lint(
  node: Node,
  tags: Record<string, { name: string; allowEmpty: boolean }[]>,
  { report }: { report: reportFunction }
) {
  if (is_tag_node(node)) {
    for (const tagName in tags) {
      if (tagName === node.name) {
        const requiredAttributes = tags[tagName];

        requiredAttributes.forEach(({ name, allowEmpty }) => {
          allowEmpty = typeof allowEmpty === "undefined" ? false : allowEmpty;

          if (!has_attribute(node, name) || !has_non_empty_attribute(node, name, allowEmpty)) {
            report({
              code: "E057",
              position: node.open.loc,
              meta: {
                data: {
                  attribute: name,
                  tag: node.name
                }
              }
            });
          }
        });
      }
    }
  }
}

export default {
  name: RULE_NAME,
  validateConfig,
  lint
} as RuleDefinition;
