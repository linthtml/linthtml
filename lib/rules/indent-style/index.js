const { create_list_value_validator } = require("../../validate_option");
const { create_validation_for_numbers } = require("../../validate_option");

module.exports = {
  name: "indent-style",
  on: ["dom"],
  need: "dom", /* 1 return node per node >< instead of the whole dom >< */
  validateConfig: create_list_value_validator(["tabs", "spaces", "nonmixed"], false),
  options: [
    // REMOVE: For the v1
    // Need to duplicate validateConfig to make it works with the old and the new Config system ><
    {
      validateConfig: create_list_value_validator(["tabs", "spaces", "nonmixed"], false)
    },
    {
      name: "indent-width", // ignored if indent-style is "tabs", display warning message ?

      validateConfig: create_validation_for_numbers(false),
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

function check_indent_width(node, expectedIndentWidth) {
  // ignore indent for text node
  if (node.type === "text") {
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

function is_indent_only(node) {
  const text = node.data || "";
  return /^([\n\r]+[\t ]*)+$/.test(text);
}

function check_indent_style(node, indent_style) {
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

function sort_children(a, b) {
  if (a.startIndex < b.startIndex) {
    return -1;
  }
  if (b.startIndex < a.startIndex) {
    return 1;
  }
  return 0;
}

function children_on_same_line(node) {
  return node.children.every(child => child.loc.start.line === node.loc.start.line);
}

function one_node_per_line(nodes) {
  return nodes.slice(1).reduce((prev, current) => {
    if (prev[prev.length - 1].loc.end.line !== current.loc.start.line) {
      prev.push(current);
    }
    return prev;
  }, nodes.slice(0, 1));
}

function nodeTagName(node) {
  if (node.type === "text") {
    return "Text Node"; // get text node content but truncate ?
  }
  return node.name;
}

function check_child(node, indent, expected_indent_width, report) {
  if (node.children && node.children.length > 0) {
    if (children_on_same_line(node) === false) {
      let children = node.children.filter(node => is_indent_only(node) === false);
      // children.
      children.sort(sort_children);

      // Check only one child per node
      children = one_node_per_line(children);
      children.forEach(child => check_node_indent(child, indent, expected_indent_width + indent.width, report));
    }
    node.children.forEach(child => check_child(child, indent, expected_indent_width + indent.width, report));
  }
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
            current_indentation: node.loc.start.column,
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

module.exports.lint = lint;

function lint(element, opts, { report }) {
  // fix /*1*/
  if (element.parent !== null) {
    return [];
  }
  const expected_indent_width = 0;
  const style = opts["indent-style"] || "spaces";
  const width = opts["indent-width"] || false;

  return check_child(element, { style, width }, expected_indent_width, report);
}
