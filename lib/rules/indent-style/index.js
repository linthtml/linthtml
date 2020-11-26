const { is_text_node } = require("../../knife/tag_utils");
const { create_list_value_validator } = require("../../validate_option");
const { create_number_validator } = require("../../validate_option");

module.exports = {
  name: "indent-style",
  on: "dom",
  validateConfig: create_list_value_validator(["tabs", "spaces", "nonmixed"], false),
  options: [
    // REMOVE: For the v1
    // Need to duplicate validateConfig to make it works with the old and the new Config system ><
    {
      validateConfig: create_list_value_validator(["tabs", "spaces", "nonmixed"], false)
    },
    {
      name: "indent-width", // ignored if indent-style is "tabs", display warning message ?

      validateConfig: create_number_validator(false),
      lint(_, __, { rules }) {
        if (rules["indent-style"]) {
          return [];
        }
        return lint(...arguments);
      }
    },
    {
      name: "indent-width-cont",
      lint(_, __, { rules }) {
        if (rules["indent-style"] || rules["indent-width"]) {
          return [];
        }
        return lint(...arguments);
      }
    },
    {
      name: "indent-delta",
      lint(_, __, { rules }) {
        if (rules["indent-style"] || rules["indent-width"] || rules["indent-width-cont"]) {
          return [];
        }
        return lint(...arguments);
      }
    }
  ]
};

function is_sibling_close_tag_same_line(node) {
  const has_previous_sibling = Boolean(node.previousSibling);
  if (!has_previous_sibling) {
    return false;
  }
  if (is_newline_only(node.previousSibling)) {
    return false;
  }

  return node.previousSibling.loc.end.line === node.loc.start.line;
}

function is_parent_open_close_same_line(node) {
  return Boolean(node.parent) &&
    node.parent.loc.start.line === node.loc.start.line &&
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
  if (open.loc.start.line === close.loc.start.line) {
    return true;
  }
  return open.loc.start.column === close.loc.start.column;
}

function is_newline_only(node) {
  const text = node.data || "";
  return /^([\n\r]+[\t ]*)+$/.test(text);
}

function check_indent_style(node, indent_style) {
  if (is_parent_open_close_same_line(node)) {
    return true;
  }
  if (is_sibling_close_tag_same_line(node)) {
    return true;
  }
  let text = node.indent;
  text = text.replace(/^\n*/, "");
  if (text === "") {
    return true;
  }
  switch (indent_style) {
    case "tabs":
      return /^[^ ]+/.test(text);
    case "spaces":
      return /^[^\t]+/.test(text);
    default:
      return /(\t+ +| +\t)/.test(text) === false;
  }
}
function indent_style_used(node, indent_style) {
  let text = node.indent;
  text = text.replace(/^\n*/, "");
  if (/^[^ ]+$/.test(text)) {
    return "tabs";
  }
  if (/^[^\t]+$/.test(text)) {
    return "spaces";
  }
  return "mixed";
}

function nodeTagName(node) {
  if (node.type === "text") {
    return "Text Node"; // get text node content but truncate ?
  }
  return node.name;
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
            tagName: nodeTagName(node),
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
            tagName: nodeTagName(node),
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
          tagName: nodeTagName(node),
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
  if (node.parent === null) {
    return level;
  }

  // Deal with text node, linthtml-disable (indent) and pre tag`?
  return node_indentation_level(node.parent, level + 1);
}

function lint(node, opts, { report }) {
  if (is_text_node(node)) {
    return;
  }
  const level = node_indentation_level(node);
  const style = opts["indent-style"] || "spaces";
  const width = opts["indent-width"] || false;

  check_node_indent(node, { style, width }, width * level, report);
}

module.exports.lint = lint;
