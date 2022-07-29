import { reportFunction, RuleDefinition } from "../../read-config";
import { is_tag_node, attribute_value, has_non_empty_attribute } from "@linthtml/dom-utils";
import { CharValue, Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "id-no-dup";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && has_non_empty_attribute(node, "id")) {
    const id = attribute_value(node, "id") as CharValue;
    // TODO: Remove after `raw-ignore-text` refacto
    if (/^¤+$/.test(id.chars)) {
      return;
    }
    // node has a duplicate id
    // @ts-ignore
    const saved_id: CharValue = this.idMap.get(id.chars);
    if (saved_id) {
      report({
        code: "E012",
        position: id.loc,
        meta: {
          data: {
            id: id.chars,
            line: saved_id.loc.start.line,
            column: saved_id.loc.start.column
          }
        }
      });
    }
    // if we haven't seen the id before, remember it
    // and pass the node
    // @ts-ignore
    this.idMap.set(id.chars, id);
  }
}

function end() {
  // wipe previous table
  // @ts-ignore
  this.idMap = new Map<string, CharValue>();
  return [];
}

export default {
  name: RULE_NAME,
  lint,
  end,
  // @ts-ignore
  idMap: new Map<string, CharValue>() // TODO: Convert rules to class to fix this issue?
} as RuleDefinition;
