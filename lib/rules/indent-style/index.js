var Issue = require("../../issue"),
  proc = require("../../process_option");

module.exports = {
  name: "indent-style",
  // on: ["line"],
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
      // process: proc.options(["tabs", "spaces", "nonmixed"]),
      process(option) {
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
      process(option) {
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
      ].join("\n"),
      process: proc.bool
    },
    {
      name: "indent-delta",
      desc: [
        "If set, check wether or not two consecutive lines have an indentation delta",
        "in the range [-1, 1]."
      ].join("\n"),
      process: proc.bool
    }
  ]
};

function check_indent_width(node, expectedIndentWidth) {
  // ignore indent for text node
  if (node.type === "text") {
    return true;
  }
  const indent = node.indent.split('');
  return indent.length === expectedIndentWidth;
}

function is_indent_only(node) {
  const text = node.data || "";
  return /^[\n\r]+[\t ]+$/.test(text);
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

function check_indents(node, indent_style, expected_indent_width, indent_width) {
  let issues = [];
  if (node.children && node.children.length > 0) {
    node.children.filter(node => is_indent_only(node) === false).forEach(child => issues = issues.concat(check_indents(child, indent_style, (expected_indent_width + indent_width), indent_width)));
  }

  // 
  // update parser to include indent inside node object (currently indent are (just tabs or spaces) are considered nodeText ><)
  // 
  if (indent_width !== false && check_indent_width(node, expected_indent_width) === false) {
    issues.push(new Issue("E036", [node.lineCol[0], node.lineCol[1]], {
      width: expected_indent_width
    }));
  }

  if (check_indent_style(node, indent_style) === false) {
    issues.push(new Issue("E024", [node.lineCol[0], node.lineCol[1]], {
      type: indent_style
    }));
  }
  return issues;
}
module.exports.lint = function(element, opts) {
  let issues = [];
  // fix /*1*/
  if (element.parent !== null) {
    return [];
  }
  let expected_indent_width = 0;
  const indent_style = opts["indent-style"] || "spaces";
  const indent_width = opts["indent-width"];

  issues = issues.concat(check_indents(element, indent_style, expected_indent_width, indent_width));

  return issues;
};
