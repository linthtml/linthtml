"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = exports.Element = exports.Node = exports.ExtendedNode = exports.Position = exports.Range = exports.NodeAttribute = exports.CharValue = void 0;
const domhandler_1 = require("domhandler");
const domelementtype_1 = require("domelementtype");
class CharValue {
    constructor(chars, loc, raw) {
        this.chars = chars;
        this.loc = loc;
        this.raw = raw;
        this.chars = chars;
        this.raw = raw;
        this.loc = loc;
    }
}
exports.CharValue = CharValue;
class NodeAttribute {
    constructor(name, loc, index, equal = null, value = null) {
        this.name = name;
        this.loc = loc;
        this.index = index;
        this.equal = equal;
        this.value = value;
        this.type = 'attribute';
        this.name = name;
        this.index = index;
        this.value = value;
        this.equal = equal;
        this.loc = loc;
    }
}
exports.NodeAttribute = NodeAttribute;
class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
        this.start = start;
        this.end = end;
    }
}
exports.Range = Range;
class Position {
    constructor(line, column) {
        this.line = line;
        this.column = column;
        this.line = line;
        this.column = column;
    }
}
exports.Position = Position;
function ExtendedNode(Base) {
    return class TExtractor extends Base {
        constructor() {
            super(...arguments);
            this._close = undefined;
        }
        get loc() {
            return this._loc;
        }
        set loc(value) {
            this._loc = value;
        }
        get open() {
            return this._open;
        }
        set open(value) {
            this._open = value;
        }
        get close() {
            return this._close;
        }
        set close(value) {
            this._close = value;
        }
    };
}
exports.ExtendedNode = ExtendedNode;
// Change NodeWithChildren type for children
class Node extends ExtendedNode(domhandler_1.NodeWithChildren) {
    constructor() {
        super(...arguments);
        this.parent = null;
        this.children = []; //{Node[]} 
    }
}
exports.Node = Node;
/**
 * An element within the DOM.
 */
class Element extends Node {
    /**
     * @param name Name of the tag, eg. `div`, `span`.
     * @param attribs Object mapping attribute names to attribute values.
     * @param children Children of the node.
     */
    constructor(name, attributes, children = [], type = name === "script"
        ? domelementtype_1.ElementType.Script
        : name === "style"
            ? domelementtype_1.ElementType.Style
            : domelementtype_1.ElementType.Tag) {
        super(type, children);
        this.name = name;
        this.attributes = attributes;
    }
    // DOM Level 1 aliases
    get tagName() {
        return this.name;
    }
    set tagName(name) {
        this.name = name;
    }
}
exports.Element = Element;
/**
 * The root node of the document.
 */
class Document extends Node {
    constructor(children) {
        super(domelementtype_1.ElementType.Root, children);
    }
}
exports.Document = Document;
