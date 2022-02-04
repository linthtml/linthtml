import { is_tag_node } from "@linthtml/dom-utils";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";
import { reportFunction, RuleDefinition } from "../../read-config";

const RULE_NAME = "id-class-no-ad";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node)) {
    // TODO: Remove after `raw-ignore-text` refacto
    const attributes = node.attributes
      .filter(({ name }) => /^¤+$/.test(name.chars) === false)
      .filter(({ name, value }) => ["id", "class"].indexOf(name.chars) !== -1 && value !== null);

    // TODO: Check what happen with empty id/class attributes
    attributes.forEach((attribute) => {
      const regex = /(^|[^a-zA-Z0-9])(ad|banner|social)(?![a-zA-Z0-9])/;
      const match = regex.exec(attribute?.value?.chars as string);
      if (match) {
        report({
          code: "E010",
          position: attribute.loc,
          meta: {
            data: {
              word: match[2],
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
