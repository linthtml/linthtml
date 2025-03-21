import { is_tag_node } from "@linthtml/dom-utils";
import type { Element, Node } from "@linthtml/dom-utils/dom_elements";
import type { reportFunction, RuleDefinition } from "../../read-config.js";

const RULE_NAME = "attr-validate";

function get_open_raw({ open }: Element) {
  const open_raw = open.raw as string;
  return open_raw
    .replace(/^</, "")
    .replace(new RegExp(`^${open.chars} `), "")
    .replace(/\/?>$/, "");
}

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node)) {
    /* eslint-disable-next-line no-useless-escape */
    const attrRegex = /^\s*([^ "'>=\^]+(\s*=\s*(("[^"]*")|('[^']*')|([^ \t\n"']+)))?\s+)*$/;
    const attributes_raw = get_open_raw(node);
    // Get rid of `+ " "`
    if (attrRegex.test(attributes_raw + " ") === false) {
      report({
        code: "E049",
        position: node.open.loc
      });
    }
  }
}

// TODO: check if this rule still work as expected
export default {
  name: RULE_NAME,
  lint
} as RuleDefinition;
