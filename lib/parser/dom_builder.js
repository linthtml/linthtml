const { DomHandler } = require("htmlparser2");
const { is_void_node } = require("../knife");

class Handler extends DomHandler {
  constructor(lineOffsets) {
    super({
      withStartIndices: true,
      withEndIndices: true
    });
    this.attributes = [];
    this.lineOffsets = lineOffsets;
  }

  get buffer() {
    return this.parser.tokenizer.buffer;
  }

  _indexToPosition(index) {
    const line = this.lineOffsets.findIndex((startIndex) => index < startIndex);
    const column = line === -1 ? index - this.lineOffsets[this.lineOffsets.length - 1] : index - this.lineOffsets[line - 1];
    return {
      line: (line === -1 ? this.lineOffsets.length : line),
      column: column + 1
    };
  }

  onerrorfunction(error) {
    // TODO: actually bubble this up or queue errors
    throw error;
  }

  __createAttributeNode(name, _value) {
    let equal = null;
    let value = null;
    const start = this.parser._attribstartindex;
    let end = this.parser.tokenizer._index;
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
      equal = {
        chars: rawEqValue,
        loc: {
          start: namePosition.end,
          end: this._indexToPosition(start + name.length + rawEqValue.length)
        }
      };
    }
    if (_value) {
      const rawValue = raw.slice(rawEqValue.length);
      value = {
        chars: _value,
        raw: rawValue,
        loc: {
          start: this._indexToPosition(start + name.length + rawEqValue.length),
          end: this._indexToPosition(end)
        }
      };
    } else {
      end = start + name.length;
    }
    return {
      type: "attribute",
      index: start, // TODO: remove ?
      name: {
        chars: name,
        loc: namePosition
      },
      value,
      equal,
      loc: {
        start: this._indexToPosition(start),
        end: this._indexToPosition(end)
      }
    };
  }

  onattribute(name, value) {
    const attribute = this.__createAttributeNode(name, value);
    this.attributes.push(attribute);
  }

  onopentag(name) {
    super.onopentag(...arguments);

    const node = this.tagStack[this.tagStack.length - 1];
    const name_index = this.parser.startIndex + 1;
    node.openIndex = this.parser.startIndex; // +1 ?
    node.open = {
      chars: this.buffer.slice(name_index, name_index + name.length),
      raw: this.buffer.slice(this.parser.startIndex, this.parser.endIndex + 1),
      loc: {
        start: this._indexToPosition(this.parser.startIndex),
        end: this._indexToPosition(this.parser.endIndex + 1)
      }
    };
    // TODO only for 'tag' nodes
    Object.defineProperty(node, "attributes", {
      value: this.attributes,
      writable: false
    });
    delete node.attribs;
    this.attributes = [];
  }

  onclosetag(name) {
    const node = this.tagStack[this.tagStack.length - 1];
    if (node && !is_void_node(node)) {
      const raw = this.buffer.slice(this.parser.startIndex, this.parser.endIndex + 1);
      node.close = {
        raw,
        chars: raw.replace(/(<|>|\/)/g, ""),
        loc: {
          start: this._indexToPosition(this.parser.startIndex),
          end: this._indexToPosition(this.parser.endIndex + 1)
        }
      };
      node.loc.end = node.close.loc.end;
    }
    node.closeIndex = this.parser.endIndex; // +1?

    super.onclosetag(...arguments);
  }

  onprocessinginstruction(name, data) {
    // htmlparser2 doesn't normally update the position when processing
    // declarations or processing directives (<!doctype ...> or <?...> elements)
    this.parser.updatePosition(1);
    super.onprocessinginstruction(...arguments);
  }

  addDataNode(node) {
    super.addDataNode(...arguments);
    node.loc = {
      start: this._indexToPosition(node.startIndex),
      end: this._indexToPosition(node.endIndex + 1)
    };
  }

  addNode(node) {
    super.addNode(...arguments);
    if (node.name === "!doctype" && node.startIndex === 1) {
      node.startIndex = 0; // start index of doctype are not correct
    }
    node.loc = {
      start: this._indexToPosition(node.startIndex),
      end: this._indexToPosition(node.endIndex + 1)
    };
  }
}

module.exports = Handler;
