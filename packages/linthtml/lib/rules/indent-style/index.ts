import { is_text_node, node_tag_name, has_parent_node, is_newline_only } from "@linthtml/dom-utils";
import { CharValue, Node, Text } from "@linthtml/dom-utils/lib/dom_elements";
import { reportFunction, RuleDefinition } from "../../read-config";
import { create_list_value_validator } from "../../validate_option";

const RULE_NAME = "indent-style";

function end_with_newline_char(node: Node) {
  if (!is_text_node(node)) {
    return false;
  }
  const text = node.data || "";
  return /([\n\r]+[\t ]*)+$/.test(text);
}

function is_sibling_close_tag_same_line(node: Node) {
  const has_previous_sibling = Boolean(node.previousSibling);
  if (!has_previous_sibling) {
    return false;
  }
  if (is_newline_only(node.previousSibling as Node) || end_with_newline_char(node.previousSibling as Node)) {
    return false;
  }

  return (node.previousSibling as Node).loc.end.line === node.loc.start.line;
}

function is_parent_open_close_same_line(node: Node) {
  return (
    has_parent_node(node) &&
    (node.parent as Node).open.loc.end.line === node.loc.start.line &&
    (node.parent as Node).loc.end.line === node.loc.end.line
  );
}

/**
 * If node parent open tag is on same line but not close tag => report error
 * If same line as previous Sibling close tag => do not report
 *     if previousSibling is new line text node ignore it
 * If alone on line and indent width not correct => report
 * If alone on line and indent width  correct => do not report
 */
function check_indent_width(node: Node, expectedIndentWidth: number) {
  if (is_parent_open_close_same_line(node)) {
    return true;
  }
  if (is_sibling_close_tag_same_line(node)) {
    return true;
  }
  return node.loc.start.column - 1 === expectedIndentWidth;
}

function check_indent_width_close({ open, close }: Node) {
  if (close === undefined) {
    return true;
  }
  if (open.loc.end.line === close.loc.start.line) {
    return true;
  }
  return open.loc.start.column === close.loc.start.column;
}

function check_indent_style(node: Node, indent_style: unknown) {
  if (is_parent_open_close_same_line(node) || is_sibling_close_tag_same_line(node)) {
    return true;
  }

  const { previousSibling } = node;
  if (previousSibling && is_newline_only(previousSibling as Node)) {
    const indent = (previousSibling as Text).data.replace(/^\n*/, "");
    if (indent === "") {
      return true;
    }
    switch (indent_style) {
      case "tabs":
        return /^[^ ]+/.test(indent);
      case "spaces":
        return /^[^\t]+/.test(indent);
      default:
        return /(\t+ +| +\t)/.test(indent) === false;
    }
  }

  return true;
}

function indent_style_used(node: Node) {
  const { previousSibling } = node;
  const indent = (previousSibling as Text).data.replace(/^\n*/, "");

  if (/^[^ ]+$/.test(indent)) {
    return "tabs";
  }
  if (/^[^\t]+$/.test(indent)) {
    return "spaces";
  }
  return "mixed";
}

function check_node_indent(
  node: Node,
  indent: { width: false | number; style: false | "spaces" | "tabs" | "mixed" },
  expected_indent_width: number,
  report: reportFunction
) {
  let indent_width_valid = true;

  if (indent.width !== false) {
    if (check_indent_width(node, expected_indent_width) === false) {
      indent_width_valid = false;
      report({
        code: "E036",
        position: node.loc,
        meta: {
          data: {
            tagName: node_tag_name(node),
            expected_indentation: expected_indent_width,
            current_indentation: node.loc.start.column - 1,
            isClose: false
          }
        }
      });
    }
    if (!check_indent_width_close(node) && indent_width_valid !== false) {
      report({
        code: "E036",
        position: (node.close as CharValue).loc,
        meta: {
          data: {
            tagName: node_tag_name(node),
            expected_indentation: expected_indent_width,
            current_indentation: (node.close as CharValue).loc.start.column - 1,
            isClose: true
          }
        }
      });
    }
  }

  if (check_indent_style(node, indent.style) === false) {
    report({
      code: "E024",
      position: node.loc,
      meta: {
        data: {
          tagName: node_tag_name(node),
          expected_type: indent.style,
          current_type: indent_style_used(node),
          expected_indentation: expected_indent_width,
          current_indentation: node.loc.start.column
        }
      }
    });
  }
}

function node_indentation_level(node: Node, level = 0): number {
  if (has_parent_node(node) === false) {
    return level;
  }

  // Deal with text node, linthtml-disable (indent) and pre tag`?
  return node_indentation_level(node.parent as Node, level + 1);
}

function lint(node: Node, _config: unknown, { report, global_config }: { report: reportFunction; global_config: any }) {
  if (is_text_node(node)) {
    return;
  }
  const level = node_indentation_level(node);
  const style: false | "spaces" | "tabs" | "mixed" = global_config["indent-style"] || "spaces"; // TODO: Get rid of false
  const width: false | number = global_config["indent-width"] || false; // TODO: Add default value?

  check_node_indent(node, { style, width }, (width as number) * level, report);
}

export default {
  name: RULE_NAME,
  validateConfig: create_list_value_validator(RULE_NAME, ["tabs", "spaces", "nonmixed"], false),
  lint
} as RuleDefinition;
