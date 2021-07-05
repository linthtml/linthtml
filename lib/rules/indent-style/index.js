const {
  is_text_node,
  node_tag_name,
  has_parent_node
} = require("../../knife/tag_utils");
const { is_newline_only } = require("../../knife/text_node_utils");
const { create_list_value_validator } = require("../../validate_option");

const RULE_NAME = "indent-style";

function end_with_newline_char(node) {
  if (!is_text_node(node)) {
    return false;
  }
  const text = node.data || "";
  return /([\n\r]+[\t ]*)+$/.test(text);
}

function is_sibling_close_tag_same_line(node) {
  const has_previous_sibling = Boolean(node.previousSibling);
  if (!has_previous_sibling) {
    return false;
  }
  if (is_newline_only(node.previousSibling) || end_with_newline_char(node.previousSibling)) {
    return false;
  }

  return node.previousSibling.loc.end.line === node.loc.start.line;
}

function is_parent_open_close_same_line(node) {
  return has_parent_node(node) &&
    node.parent.open.loc.end.line === node.loc.start.line &&
    node.parent.loc.end.line === node.loc.end.line;
}

/**
 * If node parent open tag is on same line but not close tag => report error
 * If same line as previous Sibling close tag => do not report
 *     if previousSibling is new line text node ignore it
 * If alone on line and indent width not correct => report
 * If alone on line and indent width  correct => do not report
 */
function check_indent_width(node, expectedIndentWidth) {
  if (is_parent_open_close_same_line(node)) {
    return true;
  }
  if (is_sibling_close_tag_same_line(node)) {
    return true;
  }
  return node.loc.start.column - 1 === expectedIndentWidth;
}

function check_indent_width_close({ open, close }) {
  if (close === undefined) {
    return true;
  }
  if (open.loc.end.line === close.loc.start.line) {
    return true;
  }
  return open.loc.start.column === close.loc.start.column;
}

/**
 *
 * @param {import('../../parser/index').Node} node
 * @param {*} indent_style
 * @returns {Boolean}
 */
function check_indent_style(node, indent_style) {
  if (
    is_parent_open_close_same_line(node) ||
    is_sibling_close_tag_same_line(node)
  ) {
    return true;
  }

  const { previousSibling } = node;
  if (previousSibling && is_newline_only(previousSibling)) {
    const indent = previousSibling.data.replace(/^\n*/, "");
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

function indent_style_used(node) {
  const { previousSibling } = node;
  const indent = previousSibling.data.replace(/^\n*/, "");

  if (/^[^ ]+$/.test(indent)) {
    return "tabs";
  }
  if (/^[^\t]+$/.test(indent)) {
    return "spaces";
  }
  return "mixed";
}

function check_node_indent(node, indent, expected_indent_width, report) {
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
    if (check_indent_width_close(node) === false && indent_width_valid !== false) {
      report({
        code: "E036",
        position: node.close.loc,
        meta: {
          data: {
            tagName: node_tag_name(node),
            expected_indentation: expected_indent_width,
            current_indentation: node.close.loc.start.column - 1,
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

function node_indentation_level(node, level = 0) {
  if (has_parent_node(node) === false) {
    return level;
  }

  // Deal with text node, linthtml-disable (indent) and pre tag`?
  return node_indentation_level(node.parent, level + 1);
}

// TODO: Deprecate rule
/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report, global_config }) {
  if (is_text_node(node)) {
    return;
  }
  const level = node_indentation_level(node);
  const style = global_config["indent-style"] || "spaces";
  const width = global_config["indent-width"] || false;

  check_node_indent(node, { style, width }, width * level, report);
}

module.exports = {
  name: RULE_NAME,
  validateConfig: create_list_value_validator(["tabs", "spaces", "nonmixed"], false),
  lint
};
