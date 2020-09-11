const { Parser } = require("htmlparser2");
const DomBuilder = require("./dom_builder");

class CustomParser extends Parser {
  onattribname(value) {
    super.onattribname(value);
    this._attribstartindex = this._tokenizer._index - value.length;
  }

  onattribute() {
    super.onattribute(...arguments);
    this._attribstartindex = null;
  }
}

function parse(htmlText) {
  const lineOffsets = [0];

  let match;
  const R = /(\r\n|\r|\n)/g;
  while ((match = R.exec(htmlText)) !== null) {
    const EOL = match[0];
    lineOffsets.push(match.index + EOL.length);
  }
  const domBuilder = new DomBuilder(lineOffsets);

  // more information for these options can be found at:
  // https://github.com/fb55/htmlparser2/wiki/Parser-options
  const parser = new CustomParser(domBuilder, {
    decodeEntities: false,
    // decodeEntities: true, //should always be true according to doc // enable after updating DomHandler
    lowerCaseAttributeNames: false,
    lowerCaseTags: true,
    recognizeCDATA: false,
    recognizeSelfClosing: true,
    // recognizeSelfClosing: false,
    xmlMode: false
  });
  let dom = null;

  try {
    // write to the parser
    parser.end(htmlText);
  } catch (error) {
    // report error ?
  } finally {
    // store the dom and reset the parser/handler
    dom = domBuilder.dom;
  }
  dom = merge_node_indent(dom);
  return dom;
}

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

// get rid of this ?
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

module.exports = parse;
