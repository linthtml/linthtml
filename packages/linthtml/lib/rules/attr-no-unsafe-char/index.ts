import { Node } from "@linthtml/dom-utils/lib/dom_elements";
import { is_tag_node, attribute_has_value } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";

const RULE_NAME = "attr-no-unsafe-char";

const regUnsafe =
  /* eslint-disable-next-line no-control-regex, no-misleading-character-class */
  /[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node)) {
    // TODO: Remove after `raw-ignore-text` refacto
    const attributes = node.attributes.filter(({ name }) => /^¤+$/.test(name.chars) === false);
    attributes.forEach((attribute) => {
      if (attribute_has_value(node, attribute.name.chars, regUnsafe)) {
        report({
          code: "E004",
          position: attribute.loc,
          meta: {
            data: {
              attribute: attribute.name.chars
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
