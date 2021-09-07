"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const htmlparser2_1 = require("htmlparser2");
// TODO: remove
// @ts-ignore
const dom_utils_1 = require("@linthtml/dom-utils");
const dom_elements_1 = require("@linthtml/dom-utils/dist/lib/dom_elements");
class Handler extends htmlparser2_1.DomHandler {
    constructor(lineOffsets) {
        super(() => { }, {
            withStartIndices: true,
            withEndIndices: true
        });
        /** The elements of the DOM */
        this.dom = [];
        /** The root element for the DOM */
        this.root = new dom_elements_1.Document(this.dom);
        this.attributes = [];
        this.lineOffsets = lineOffsets;
        this.tagStack = [this.root];
    }
    get _parser() {
        // @ts-ignore
        return this.parser;
    }
    get buffer() {
        return this._parser.tokenizer.buffer;
    }
    _indexToPosition(index) {
        const line = this.lineOffsets.findIndex((startIndex) => index < startIndex);
        const column = line === -1 ? index - this.lineOffsets[this.lineOffsets.length - 1] : index - this.lineOffsets[line - 1];
        return new dom_elements_1.Position(line === -1
            ? this.lineOffsets.length
            : line, column + 1);
    }
    __createAttributeNode(name, attribute_value) {
        let equal = null;
        let value = null;
        const start = this._parser.startIndex; // Use this.startIndex instead (since htmlparser 7.1?)
        let end = this._parser.endIndex;
        if (/\s|\n/.test(this.buffer[end]) === false) {
            end++;
        }
        const namePosition = {
            start: this._indexToPosition(start),
            end: this._indexToPosition(start + name.length)
        };
        const raw = this.buffer.slice(start + name.length, end);
        const match = raw.match(/\s*=\s*/);
        const rawEqValue = match ? match[0] : null;
        if (rawEqValue) {
            const loc = new dom_elements_1.Range(namePosition.end, this._indexToPosition(start + name.length + rawEqValue.length));
            equal = new dom_elements_1.CharValue(rawEqValue, loc);
        }
        if (attribute_value) {
            const rawValue = raw.slice(rawEqValue.length);
            const loc = new dom_elements_1.Range(this._indexToPosition(start + name.length + rawEqValue.length), this._indexToPosition(end));
            // remove extra spaces newline? (attribute_value)
            value = new dom_elements_1.CharValue(attribute_value, loc, rawValue);
        }
        else {
            end = start + name.length;
        }
        return new dom_elements_1.NodeAttribute(new dom_elements_1.CharValue(name, namePosition), {
            start: this._indexToPosition(start),
            end: this._indexToPosition(end)
        }, start, equal, value);
    }
    //@ts-ignore
    onattribute(name, value, quote) {
        debugger;
        const attribute = this.__createAttributeNode(name, value);
        this.attributes.push(attribute);
    }
    onopentag(name /* , attribs: { [key: string]: string }*/) {
        // @ts-ignore
        const type = this.options.xmlMode ? ElementType.Tag : undefined;
        const node = new dom_elements_1.Element(name, this.attributes, undefined, type);
        this.addNode(node);
        this.tagStack.push(node);
        const name_index = this._parser.startIndex + 1;
        node.open = {
            chars: this.buffer.slice(name_index, name_index + name.length),
            raw: this.buffer.slice(this._parser.startIndex, this._parser.endIndex + 1),
            loc: {
                start: this._indexToPosition(this._parser.startIndex),
                end: this._indexToPosition(this._parser.endIndex + 1)
            }
        };
        this.attributes = [];
    }
    onclosetag() {
        const node = this.tagStack[this.tagStack.length - 1];
        if (node && !(0, dom_utils_1.is_void_node)(node)) {
            const raw = this.buffer.slice(this._parser.startIndex, this._parser.endIndex + 1);
            node.close = {
                raw,
                chars: raw.replace(/(<|>|\/)/g, ""),
                loc: {
                    start: this._indexToPosition(this._parser.startIndex),
                    end: this._indexToPosition(this._parser.endIndex + 1)
                }
            };
            node.loc.end = node.close.loc.end;
        }
        super.onclosetag();
    }
    addNode(node) {
        super.addNode(node);
        node.loc = {
            start: this._indexToPosition(node.startIndex),
            end: this._indexToPosition(node.endIndex + 1)
        };
    }
}
exports.default = Handler;
