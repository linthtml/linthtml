import { Parser } from "htmlparser2";
import DomBuilder from "./dom_builder.js";
// TODO find a way to have /dom_elements
import type { Document } from "@linthtml/dom-utils";
import render from "dom-serializer";
/**
 * Parse an HTML text and return an AST tree
 *
 * @param {string} htmlText
 * @returns {Node{}}
 */
export function parse(htmlText: string): Document {
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
  const parser = new Parser(domBuilder, {
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
    console.log(error);
    // report error ?
  } finally {
    // store the dom and reset the parser/handler
    dom = domBuilder.root;
  }
  return dom;
}

export function render(root: Document) {
  return render(root);
}
