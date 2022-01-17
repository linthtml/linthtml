import { reportFunction, RuleDefinition } from "../../read-config";
import { is_tag_node, has_attribute, attribute_value, get_attribute } from "@linthtml/dom-utils";
import { create_list_value_validator } from "../../validate_option";
import { Node, NodeAttribute } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "href-style";

function lint(node: Node, format: string, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "a") {
    // TODO: Should return an issue, since a without href is bad
    // TODO: Check empty href attributes
    if (has_attribute(node, "href") === false) {
      return;
    }

    const href_value = attribute_value(node, "href")?.chars as string;

    // TODO: Remove after `raw-ignore-text` refacto
    if (/^¤+$/.test(href_value)) {
      return;
    }

    // Allow fragment-only URLs
    const is_fragment = href_value.startsWith("#");
    // Link must be absolute if specified format is absolute
    const is_absolute = href_value.search("://") !== -1;
    const match_format = is_absolute === (format === "absolute");
    if (is_fragment === false && match_format === false) {
      const attribute = get_attribute(node, "href") as NodeAttribute;
      report({
        code: "E009",
        position: attribute.loc,
        meta: {
          data: {
            format: format
          }
        }
      });
    }
  }
}

export default {
  name: RULE_NAME,
  lint,
  validateConfig: create_list_value_validator(RULE_NAME, ["absolute", "relative"], false)
} as RuleDefinition;
