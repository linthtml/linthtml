import { is_directive_node } from "@linthtml/dom-utils";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";
import { reportFunction, RuleDefinition } from "../../read-config";

const RULE_NAME = "doctype-html5";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_directive_node(node) && node.name.toUpperCase() === "!DOCTYPE") {
    // NOTE: this does not support legacy strings or obsolete permitted doctypes
    const html5_doctype = /^!DOCTYPE[ \t\n\f]+html[ \t\n\f]*$/i;

    if (!html5_doctype.test(node.data)) {
      report({
        code: "E008",
        position: node.loc
      });
    }
  }
}

export default {
  name: RULE_NAME,
  lint,
  filter: ["directive"] // remove filter
} as RuleDefinition;
