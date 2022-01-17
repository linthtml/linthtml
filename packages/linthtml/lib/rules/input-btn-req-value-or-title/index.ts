import { has_non_empty_attribute, is_tag_node, attribute_value } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "input-btn-req-value-or-title";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "input") {
    const type = attribute_value(node, "type");
    const value = attribute_value(node, "value");
    const title = attribute_value(node, "title");
    if (!type || ["button", "submit", "reset"].indexOf(type.chars) === -1) {
      return;
    }

    if (!(value || title || has_non_empty_attribute(node, "aria-label"))) {
      report({
        code: "E060",
        position: node.open.loc
      });
    }
  }
}

export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;

// Valid for axe-core
/*
<input type="button" value="button"/>

<input type="button" title="button" />

<input type="button" aria-labelledby="foo">
<span id="foo">Button</span>

<input type="button" aria-label="button" />

*/
