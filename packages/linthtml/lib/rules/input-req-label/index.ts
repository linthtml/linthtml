import Issue from "../../issue";
import { is_tag_node, attribute_value, attribute_has_value } from "@linthtml/dom-utils";
import { Element, Node, Range } from "@linthtml/dom-utils/lib/dom_elements";
import { reportFunction, RuleDefinition } from "../../read-config";

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
      // @ts-ignore
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
  // TODO: check if
  // @ts-ignore
  for (let e = node; (e = e.parent); ) {
    if (e.name === "label") {
      return;
    }
  }

  // check if the input has a named label, by storing the values to
  // check at the end.
  const id = attribute_value(node, "id");
  if (id) {
    // @ts-ignore
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
    // @ts-ignore
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
  // @ts-ignore
  this.labels = {};
  // @ts-ignore
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
