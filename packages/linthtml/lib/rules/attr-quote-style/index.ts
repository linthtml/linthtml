import { Node } from "@linthtml/dom-utils/lib/dom_elements";
import { is_tag_node } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";
import { create_list_value_validator } from "../../validate_option";

const RULE_NAME = "attr-quote-style";

const formats: Record<string, { regex: RegExp; desc: string }> = {
  double: { regex: /^"/, desc: "double quoted" },
  single: { regex: /^'/, desc: "single quoted" },
  quoted: { regex: /^['"]/, desc: "quoted" }
};

function lint(node: Node, config: string, { report }: { report: reportFunction }) {
  if (is_tag_node(node)) {
    // TODO: Remove after `raw-ignore-text` refacto
    const attributes = node.attributes.filter(({ name }) => /^¤+$/.test(name.chars) === false);
    const format = formats[config];
    attributes.forEach((attribute) => {
      if (attribute.value !== null && !format.regex.test(attribute.value.raw as string)) {
        report({
          code: "E005",
          position: attribute.value.loc,
          meta: {
            data: {
              attribute: attribute.name.chars,
              format: format.desc
            }
          }
        });
      }
    });
  }
}

export default {
  name: RULE_NAME,
  validateConfig: create_list_value_validator(RULE_NAME, ["double", "single", "quoted"], false),
  lint
} as RuleDefinition;
