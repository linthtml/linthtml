"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const htmlparser2_1 = require("htmlparser2");
const dom_builder_1 = __importDefault(require("./dom_builder"));
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
    const domBuilder = new dom_builder_1.default(lineOffsets);
    // more information for these options can be found at:
    // https://github.com/fb55/htmlparser2/wiki/Parser-options
    const parser = new htmlparser2_1.Parser(domBuilder, {
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
    }
    catch (error) {
        console.log(error);
        // report error ?
    }
    finally {
        // store the dom and reset the parser/handler
        dom = domBuilder.root;
    }
    return dom;
}
exports.default = parse;
