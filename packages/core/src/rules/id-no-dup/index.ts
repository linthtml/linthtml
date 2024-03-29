import type { reportFunction, RuleDefinition } from "../../read-config.js";
import { is_tag_node, attribute_value, has_non_empty_attribute } from "@linthtml/dom-utils";
import type { CharValue, Node } from "@linthtml/dom-utils/dom_elements";

const RULE_NAME = "id-no-dup";

function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && has_non_empty_attribute(node, "id")) {
    const id = attribute_value(node, "id") as CharValue;
    // TODO: Remove after `raw-ignore-text` refacto
    if (/^¤+$/.test(id.chars)) {
      return;
    }
    // node has a duplicate id
    // @ts-expect-error To remove once moved to visitor pattern
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
    // @ts-expect-error To remove once moved to visitor pattern
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.idMap.set(id.chars, id);
  }
}

function end() {
  // wipe previous table
  // @ts-expect-error To remove once moved to visitor pattern
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  this.idMap = new Map<string, CharValue>();
  return [];
}

export default {
  name: RULE_NAME,
  lint,
  end,
  idMap: new Map<string, CharValue>()
} as RuleDefinition;
