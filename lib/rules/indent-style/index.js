module.exports = {
  name: "indent-style",
  on: ["dom"],
  need: "dom", /* 1 return node per node >< instead of the whole dom >< */
  validateConfig(option) {
    if (typeof option !== "string") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string got ${typeof option}`);
    }
    if (["tabs", "spaces", "nonmixed"].indexOf(option) === -1) {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Indent style "${option}" is not valid. Valid indent styles are "tabs", "spaces" and "nonmixed"`);
    }
    return option;
  },
  options: [
    // REMOVE: For the v1
    // Need to duplicate validateConfig to make it works with the old and the new Config system ><
    {
      validateConfig(option) {
        if (typeof option !== "string") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string got ${typeof option}`);
        }
        if (["tabs", "spaces", "nonmixed"].indexOf(option) === -1) {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Indent style "${option}" is not valid. Valid indent styles are "tabs", "spaces" and "nonmixed"`);
        }
        return option;
      }
    },
    {
      name: "indent-width", // ignored if indent-style is "tabs", display warning message ?

      validateConfig(option) {
        if (typeof option !== "number") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Expected number got ${typeof option}`);
        }
        if (option < 0) {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Only positive indent value are allowed.`);
        }
        return option;
      },
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
  const indent = node.indent.split("");
  return indent.length === expectedIndentWidth;
}

function check_indent_width_close(node) {
  if (node.closeLineCol === undefined) {
    return true;
  }
  if (node.openLineCol[0] === node.closeLineCol[0]) {
    return true;
  }
  return node.openLineCol[1] === node.closeLineCol[1];
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

function sort_children(a, b) {
  if (a.lineCol[0] < b.lineCol[0]) {
    return -1;
  }
  if (a.lineCol[0] < b.lineCol[0]) {
    return 1;
  }
  return 0;
}

function children_on_same_line(node) {
  return node.children.every(child => child.lineCol[0] === node.lineCol[0]);
}

function one_node_per_line(nodes) {
  return nodes.slice(1).reduce((prev, current) => {
    if (prev[prev.length - 1].lineCol[0] !== current.lineCol[0]) {
      prev.push(current);
    }
    return prev;
  }, nodes.slice(0, 1));
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
        position: [node.lineCol[0], node.lineCol[1]],
        meta: {
          data: {
            expected: expected_indent_width,
            width: node.indent.length
          }
        }
      });
    }
    if (check_indent_width_close(node) === false && indent_width_valid !== false) {
      report({
        code: "E036",
        position: [node.closeLineCol[0], node.closeLineCol[1]],
        meta: {
          data: {
            expected: expected_indent_width,
            width: node.closeLineCol[1]
          }
        }
      });
    }
  }

  if (check_indent_style(node, indent.style) === false) {
    report({
      code: "E024",
      position: [node.lineCol[0], node.lineCol[1]],
      meta: {
        data: {
          type: indent.style
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
  const width = opts["indent-width"];

  return check_child(element, { style, width }, expected_indent_width, report);
}
