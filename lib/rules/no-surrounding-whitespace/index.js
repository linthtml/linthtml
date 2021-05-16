const { is_text_node, has_parent_node } = require("../../knife/tag_utils");
const { get_lines } = require("../../knife/text_node_utils");

const RULE_NAME = "no-surrounding-whitespace";

// TODO make shared function
function get_helpful_line_positions(node) {
  return {
    next_sibling_line: node.nextSibling
      ? node.nextSibling.loc.start.line
      : -1,
    previous_sibling_line: node.previousSibling
      ? node.previousSibling.loc.end.line
      : -1,
    node_start_line: node.loc.start.line,
    node_end_line: node.loc.end.line,
    parent_close_line: has_parent_node(node)
      ? node.parent.loc.end.line
      : -1,
    parent_start_line: has_parent_node(node)
      ? node.parent.loc.start.line
      : -1
  };
}

function should_report_before_error(node, { text, offset }) {
  const {
    previous_sibling_line,
    node_start_line,
    parent_start_line
  } = get_helpful_line_positions(node);

  const current_line = node_start_line + offset;
  const start_whitespace = /^[\s\uFEFF\xA0]+/.exec(text);
  return start_whitespace &&
    ((current_line === parent_start_line &&
    current_line !== previous_sibling_line) ||
    (current_line !== parent_start_line &&
      current_line === previous_sibling_line));
}

function generate_position_before_error(node, { text, offset }) {
  const {
    node_start_line
  } = get_helpful_line_positions(node);

  const current_line = node_start_line + offset;
  const start_whitespace = /^[\s\uFEFF\xA0]+/.exec(text);
  return {
    start: {
      line: current_line,
      column: node.loc.start.column
    },
    end: {
      line: current_line,
      column: node.loc.start.column + start_whitespace[0].length
    }
  };
}

function should_report_after_error(node, { text, offset }) {
  const {
    next_sibling_line,
    node_start_line,
    parent_close_line
  } = get_helpful_line_positions(node);

  const current_line = node_start_line + offset;
  const end_whitespace = /[\s\uFEFF\xA0]+$/.exec(text);
  return end_whitespace &&
    text !== end_whitespace[0] &&
    current_line === parent_close_line &&
    current_line !== next_sibling_line;
}

function generate_position_after_error(node, { text, offset }) {
  const {
    node_start_line
  } = get_helpful_line_positions(node);

  const current_line = node_start_line + offset;
  const end_whitespace = /[\s\uFEFF\xA0]+$/.exec(text);
  return {
    start: {
      line: current_line,
      column: node.loc.end.column - end_whitespace[0].length
    },
    end: {
      line: current_line,
      column: node.loc.end.column
    }
  };
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (!is_text_node(node)) {
    return;
  }

  const lines = get_lines(node);

  lines.forEach((line) => {
    if (should_report_before_error(node, line)) {
      report({
        code: "E064",
        position: generate_position_before_error(node, line),
        meta: {
          data: {
            is_before: true
          }
        }
      });
    }

    if (should_report_after_error(node, line)) {
      report({
        code: "E064",
        position: generate_position_after_error(node, line),
        meta: {
          data: {
            is_before: false
          }
        }
      });
    }
  });
}

module.exports = {
  name: RULE_NAME,
  // validateConfig ??? before, after option?
  lint
};
