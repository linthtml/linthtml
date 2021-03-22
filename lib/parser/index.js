const { Parser } = require("htmlparser2");
const DomBuilder = require("./dom_builder");

/**
 * @typedef {object} CharValue
 * @property {string} chars
 * @property {string | undefined} raw
 * @property {Position} loc
 */

/**
 * @typedef {object} NodeAttribute
 * @property {string} type
 * @property {CharValue} name
 * @property {CharValue} value
 * @property {CharValue} equal
 * @property {Position} loc
 */

/**
 * @typedef {object} Position
 * @property {Range} start
 * @property {Range} end
 */

/**
 * @typedef {Range}
 * @property {integer} line
 * @property {integer} column
 */

/**
 * @typedef {object} Node
 * @property {('tag'|'text'|'directive'|'comment'|'root')} type
 * @property {Node | null} parent
 * @property {Node | null} previousSibling
 * @property {Node | null} nextSibling
 * @property {integer} startIndex
 * @property {integer} endIndex
 * @property {integer} openIndex
 * @property {Node[]} children
 * @property {string} name - tag name
 * @property {string | null} data -> only text node
 * @property {NodeAttribute[] | null} attributes
 * @property {Position} loc
 * @property {CharValue} open
 * @property {CharValue} close
 */

class CustomParser extends Parser {
  onattribname(value) {
    super.onattribname(value);
    this._attribstartindex = this.tokenizer._index - value.length;
  }

  onattribute() {
    super.onattribute(...arguments);
    this._attribstartindex = null;
  }
}
/**
 * Parse an HTML text and return an AST tree
 *
 * @param {string} htmlText
 * @returns {Node{}}
 */
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
    dom = domBuilder.root;
  }
  return dom;
}

module.exports = parse;
