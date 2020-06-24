const { DomHandler } = require("htmlparser2");
const { isVoidElement } = require("../knife");

class Handler extends DomHandler {
  constructor(lineOffsets) {
    super({
      withStartIndices: true,
      withEndIndices: true
    });
    this.attributes = [];
    this.lineOffsets = lineOffsets;
    this.wasClosed = true;
  }

  get buffer() {
    return this._parser._tokenizer._buffer;
  }

  _indexToPosition(index) {
    const line = this.lineOffsets.findIndex((startIndex) => index < startIndex);
    const column = line === -1 ? index - this.lineOffsets[this.lineOffsets.length - 1] : index - this.lineOffsets[line - 1];
    return {
      line: (line === -1 ? this.lineOffsets.length : line),
      column: column + 1
    };
  }

  start(htmlText) {
    this.htmlText = htmlText;
    // When a tag has no close, startIndex is too large by 3 for the
    // next calls to onopentag and _addDomElement. Keep track of this.
  }

  onerrorfunction(error) {
    // TODO: actually bubble this up or queue errors
    throw error;
  }

  __createAttributeNode(name, _value) {
    let equal = null;
    let value = null;
    const start = this._parser._attribstartindex;
    let end = this._parser._tokenizer._index;
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

  /* eslint-disable no-underscore-dangle */
  onopentag(name) {
    super.onopentag(...arguments);

    const node = this._tagStack[this._tagStack.length - 1];
    node.openIndex = this._parser.startIndex;
    if (!this.wasClosed) {
      node.openIndex -= 3;
    }
    this.wasClosed = true;
    node.open = this.htmlText.slice(node.openIndex + 1, this._parser.endIndex);
    node.openLineCol = this._indexToPosition(node.openIndex);
    // remove duplicate data
    // delete node.lineCol;

    node.attributes = this.attributes;
    delete node.attribs;
    this.attributes = [];
  }

  onclosetag() {
    const node = this._tagStack[this._tagStack.length - 1];

    if (node && !isVoidElement(node.name)) {
      // Mercifully, no whitespace is allowed between < and /
      this.wasClosed = this.htmlText[this._parser.startIndex + 1] === "/";
      node.close = this.wasClosed
        ? this.htmlText.slice(this._parser.startIndex + 2, this._parser.endIndex)
        : "";

      node.closeIndex = this._parser.startIndex;
      if (!this.wasClosed && node.closeIndex === node.openIndex) {
        node.closeIndex += node.open.length + 1;
      }
      node.closeLineCol = this._indexToPosition(node.closeIndex);
    }

    super.onclosetag(...arguments);
  }

  onprocessinginstruction(name, data) {
    // htmlparser2 doesn't normally update the position when processing
    // declarations or processing directives (<!doctype ...> or <?...> elements)
    this._parser._updatePosition(2);
    super.onprocessinginstruction(...arguments);
  }

  _addDomElement(node) {
    if (!this._parser) {
      // TODO: rewrite error msg
      throw new Error("stop being a bone head >.<");
    }
    node.index = this._parser.startIndex;
    if (!this.wasClosed) {
      node.index -= 3;
    }
    node.lineCol = this._indexToPosition(node.index);
    super._addDomElement(...arguments);
  }
  /* eslint-enable no-underscore-dangle */
}

module.exports = Handler;
