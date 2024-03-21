import Issue from "../../issue.js";
import { is_tag_node, attribute_value, attribute_has_value } from "@linthtml/dom-utils";
import { Element, Node, Range } from "@linthtml/dom-utils/dom_elements";
import { reportFunction, RuleDefinition } from "../../read-config.js";

const RULE_NAME = "input-req-label";

function is_input_or_label(node: Element) {
  return ["input", "label"].indexOf(node.name) !== -1;
}

// TODO: Cleanup rule
function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (!is_tag_node(node) || is_input_or_label(node) === false) {
    return;
  }

  // if it's a label with a 'for', store that value
  if (node.name === "label") {
    const for_attribute = attribute_value(node, "for");
    if (for_attribute) {
      // @ts-expect-error To remove once moved to visitor pattern
      this.labels[for_attribute.chars] = node;
    }
    return;
  }

  if (attribute_has_value(node, "type", "hidden")) {
    return;
  }

  if (attribute_has_value(node, "type", "button")) {
    const value = attribute_value(node, "value");
    if (value === null || value.chars.trim() === "") {
      return report({
        code: "E033",
        position: node.open.loc,
        meta: {
          data: {
            idValue: "null"
          }
        }
      });
    }
    return;
  }

  // check if the input has a label as a parent.
  let parent = node.parent as Element; // TODO: Fix typing for parent node
  while (parent) {
    if (parent.name === "label") {
      return;
    }
    parent = node.parent as Element;
  }

  // check if the input has a named label, by storing the values to
  // check at the end.
  const id = attribute_value(node, "id");
  if (id) {
    // @ts-expect-error To remove once moved to visitor pattern
    this.inputsInfo.push({
      id: id.chars,
      loc: node.open.loc
    });
  } else {
    report({
      code: "E033",
      position: node.open.loc,
      meta: {
        data: {
          idValue: "null"
        }
      }
    });
  }
}

// REMOVE
function end() {
  const issues: Issue[] = [];
  const {
    inputsInfo,
    labels
  }: {
    inputsInfo: {
      id: string;
      loc: Range;
    }[];
    labels: Record<string, Node>;
    // @ts-expect-error To remove once moved to visitor pattern
  } = this;
  inputsInfo.forEach(({ id, loc }) => {
    if (!labels[id]) {
      issues.push(
        new Issue(RULE_NAME, loc, {
          code: "E033",
          rule: RULE_NAME,
          data: {
            idValue: id
          }
        })
      );
    }
  });

  // wipe previous table
  // @ts-expect-error To remove once moved to visitor pattern
  this.labels = {};
  // @ts-expect-error To remove once moved to visitor pattern
  this.inputsInfo = [];

  return issues;
}

export default {
  name: RULE_NAME,
  lint,
  end,

  labels: {},
  inputsInfo: []
} as RuleDefinition;
