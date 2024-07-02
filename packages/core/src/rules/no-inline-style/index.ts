import { get_attribute, is_tag_node } from "@linthtml/dom-utils";
import type { RuleDefinition } from "../../read-config.js";

const RULE_NAME = "no-inline-style";

export default {
  name: RULE_NAME,
  lint(node, _rule_config, { report }) {
    if (!is_tag_node(node)) {
      return;
    }

    const style_attribute = get_attribute(node, "style");

    if (style_attribute) {
      report({
        code: "E065",
        position: style_attribute.loc
      });
    }
  }
} satisfies RuleDefinition;
