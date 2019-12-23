const htmlparser2 = require("htmlparser2");
const DomBuilder = require("./dom_builder");

const Parser = function() {
  this.domBuilder = new DomBuilder();

  // more information for these options can be found at:
  // https://github.com/fb55/htmlparser2/wiki/Parser-options
  this.parser = new htmlparser2.Parser(this.domBuilder, {
    decodeEntities: false,
    lowerCaseAttributeNames: false,
    lowerCaseTags: false,
    recognizeCDATA: false,
    recognizeSelfClosing: false,
    xmlMode: false
  });
  this.domBuilder.initialize(this.parser);
};
module.exports = Parser;

Parser.prototype.parse = function(htmlText) {
  let dom = null;

  // expose the raw html text to the dom builder and initialize
  this.domBuilder.start(htmlText);

  try {
    // write to the parser
    this.parser.write(htmlText);
    this.parser.end();
  } finally {
    // htmlparser2 is insane >.>
    this.parser.startIndex = 0;
    this.parser.endIndex = -1;

    // store the dom and reset the parser/handler
    dom = this.domBuilder.dom;
    this.parser.reset();
  }
  dom = merge_node_indent(dom);
  dom = update_line_col_if_needed(dom);
  return dom;
};

function is_indent_only(node) {
  const text = node.data || "";
  return /^([\n\r]+[\t ]+)+$/.test(text);
}

function get_node_indent(node) {
  let text = node.data || "";
  text = text.replace(/^[\n\r]+/, "");
  const indent = text.match(/^[\t ]+/);
  return indent !== null ? indent[0] : "";
}

function get_node_indent_end(node) {
  const text = node.data || "";
  const indent = text.match(/[\t ]+$/);
  return indent !== null ? indent[0] : "";
}

function merge_node_indent(dom) {
  return dom.map((node, i) => {
    if (node.indent === undefined) {
      node.indent = "";
      if (node.type === "text") {
        node.indent = get_node_indent(node);
      }
    }
    if (is_indent_only(node) && dom[i + 1]) {
      dom[i + 1].indent = get_node_indent(node);
    }
    // Text nodes followed by a tag an a new lines contains indent for nex tag ><
    if (node.type === "text" && dom[i + 1]) {
      dom[i + 1].indent = get_node_indent_end(node);
    }
    if (node.children) {
      node.children = merge_node_indent(node.children);
    }
    return node;
  });
}

function update_line_col_if_needed(dom) {
  return dom.map((node) => {
    if (node.type === "text" && is_indent_only(node) === false) {
      // todo: Remove after dom parser refactor. Text node should not contain '\n' (at the beginning at least)
      node.lineCol[0] = /^\n/gmi.test(node.data) ? node.lineCol[0] + 1 : node.lineCol[0];
    }

    if (node.children) {
      node.children = update_line_col_if_needed(node.children);
    }

    return node;
  });
}
