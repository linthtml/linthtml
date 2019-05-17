const Issue = require("../../issue");

function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

module.exports = {
  name: "indent-style",
  on: ["dom"], /* 1 return node per node >< instead of the whole dom >< */
  options: [
    {
      desc: [
        '* "tabs": Only tabs may be used for indentation.',
        '* "spaces": Only spaces may be used for indentation.',
        '* "nonmixed": Either tabs or spaces may be used, but not both',
        "    in the same file.",
        "* `false`: No restriction."
      ].join("\n"),
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
      desc: [
        "The value of this option is either `false` or a positive integer. If it",
        "is a number and spaces are used for indentation, then spaces used to",
        "indent must come in multiples of that number."
      ].join("\n"),
      validateConfig(option) {
        if (typeof option !== "number") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Expected number got ${typeof option}`);
        }
        if (option < 0) {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Only positive indent value are allowed.`);
        }
        return option;
      }
    },
    {
      name: "indent-width-cont",
      desc: [
        "If set, ignore `indent-width` for lines whose first non-whitespace",
        "character is not `<`. This is known as continuation indent because it",
        "enables the user to continue tags onto multiple lines while aligning the",
        "attribute names."
      ].join("\n")
    },
    {
      name: "indent-delta",
      desc: [
        "If set, check wether or not two consecutive lines have an indentation delta",
        "in the range [-1, 1]."
      ].join("\n")
    }
  ]
};

function merge_issues_arrays(a, b) {
  a = flatten(a);
  b = flatten(b);
  return [].concat(a, b);
}

function check_indent_width(node, expectedIndentWidth) {
  // ignore indent for text node
  if (node.type === "text") {
    return true;
  }
  const indent = node.indent.split('');
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
  text = text.replace(/^\n*/, '');
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
  }, nodes.slice(0,1));
}

function check_child(node, indent_style, expected_indent_width, indent_width) {
  let issues = [];
  if (node.children && node.children.length > 0) {
    if (children_on_same_line(node) === false) {
      
      let children = node.children.filter(node => is_indent_only(node) === false);
      // children.
      children.sort(sort_children);
      
      // Check only one child per node
      children = one_node_per_line(children);
      let children_issues = children.map(child => check_node_indent(child, indent_style, expected_indent_width + indent_width, indent_width));
      issues = merge_issues_arrays(issues, children_issues);
    }
    let tmp = node.children.map(child => check_child(child, indent_style, expected_indent_width + indent_width, indent_width));
    issues = merge_issues_arrays(issues, tmp);
  }
  return issues;
}

function check_node_indent(node, indent_style, expected_indent_width, indent_width) {
  let indent_width_valid = true;
  let issues = [];

  if (indent_width !== false) {
    if (check_indent_width(node, expected_indent_width) === false) {
      indent_width_valid = false;
      issues.push(new Issue("E036", [node.lineCol[0], node.lineCol[1]], {
        expected: expected_indent_width,
        width: node.indent.length
      }));
    }
    if (check_indent_width_close(node) === false && indent_width_valid !== false) {
      issues.push(new Issue("E036", [node.closeLineCol[0], node.closeLineCol[1]], {
        expected: expected_indent_width,
        width: node.closeLineCol[1]
      }));
    }
  }


  if (check_indent_style(node, indent_style) === false) {
    issues.push(new Issue("E024", [node.lineCol[0], node.lineCol[1]], {
      type: indent_style
    }));
  }
  return issues;
}

module.exports.lint = function(element, opts) {
  // fix /*1*/
  if (element.parent !== null) {
    return [];
  }
  let expected_indent_width = 0;
  const indent_style = opts["indent-style"] || "spaces";
  const indent_width = opts["indent-width"];

  return check_child(element, indent_style, expected_indent_width, indent_width);
};
