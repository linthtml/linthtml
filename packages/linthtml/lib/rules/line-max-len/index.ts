import { is_text_node, has_parent_node, get_lines } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";
import { create_number_validator } from "../../validate_option";
import { Node, Text } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "line-max-len";

function get_helpful_line_positions(node: Node) {
  return {
    sibling_start_line: node.nextSibling ? (node.nextSibling as Node).loc.start.line : -1,
    node_start_line: node.loc.start.line,
    node_end_line: node.loc.end.line,
    parent_close_line: has_parent_node(node) ? node.parent.loc.end.line : -1,
    children_start_line: node.children && node.children.length > 0 ? node.children[0].loc.start.line : -1
  };
}

function check_text_node(node: Text, max_length: number, report: reportFunction) {
  const { sibling_start_line, node_start_line, parent_close_line } = get_helpful_line_positions(node);

  const lines = get_lines(node);
  lines.forEach(({ offset, text }) => {
    // const len = lineText.length;
    const line_length = offset === 0 ? node.loc.start.column - 1 + text.length : text.length;
    const text_line = node_start_line + offset;
    if (line_length > max_length && text_line !== sibling_start_line && text_line !== parent_close_line) {
      report({
        code: "E040",
        position: {
          start: {
            line: node_start_line,
            column: 0
          },
          end: {
            line: node_start_line,
            column: line_length
          }
        },
        meta: {
          data: {
            maxlength: max_length,
            length: line_length
          }
        }
      });
    }
  });
}

function check_open_close_same_line(node: Node, max_length: number, report: reportFunction) {
  const { node_end_line, sibling_start_line, parent_close_line } = get_helpful_line_positions(node);

  if (
    node_end_line !== sibling_start_line &&
    node_end_line !== parent_close_line &&
    node.loc.end.column - 1 > max_length
  ) {
    report({
      code: "E040",
      position: {
        start: {
          line: node_end_line,
          column: 0
        },
        end: {
          line: node_end_line,
          column: node.loc.end.column
        }
      },
      meta: {
        data: {
          maxlength: max_length,
          length: node.loc.end.column
        }
      }
    });
  }
}

function check_open_close_not_same_line(node: Node, max_length: number, report: reportFunction) {
  const { sibling_start_line, node_end_line, node_start_line, children_start_line, parent_close_line } =
    get_helpful_line_positions(node);

  if (
    sibling_start_line !== node_start_line &&
    node_start_line !== children_start_line &&
    node.loc.start.column - 1 > max_length
  ) {
    report({
      code: "E040",
      position: {
        start: {
          line: node_start_line,
          column: 0
        },
        end: {
          line: node_start_line,
          column: node.loc.start.column
        }
      },
      meta: {
        data: {
          maxlength: max_length,
          length: node.loc.start.column
        }
      }
    });
  }
  if (
    sibling_start_line !== node_end_line &&
    parent_close_line !== node_end_line &&
    node.loc.end.column - 1 > max_length
  ) {
    report({
      code: "E040",
      position: {
        start: {
          line: node_end_line,
          column: 0
        },
        end: {
          line: node_end_line,
          column: node.loc.end.column
        }
      },
      meta: {
        data: {
          maxlength: max_length,
          length: node.loc.end.column
        }
      }
    });
  }
}

function check_tag_node(node: Node, max_length: number, report: reportFunction) {
  const { node_end_line, node_start_line } = get_helpful_line_positions(node);

  if (node_start_line !== node_end_line) {
    check_open_close_not_same_line(node, max_length, report);
  } else {
    check_open_close_same_line(node, max_length, report);
  }
}
// TODO: Check what happen if max_length empty
function lint(node: Node, max_length: number, { report }: { report: reportFunction }) {
  if (is_text_node(node)) {
    return check_text_node(node, max_length, report);
  }
  return check_tag_node(node, max_length, report);
}

export default {
  name: RULE_NAME,
  validateConfig: create_number_validator(RULE_NAME, false),
  lint
} as RuleDefinition;
