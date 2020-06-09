const { DomHandler } = require("htmlparser2");
const { isVoidElement, inputIndices } = require("../knife");

class Handler extends DomHandler {
  constructor(lineOffsets) {
    super({
      withStartIndices: true,
      withEndIndices: true
    });
    this.attributes = {};
    this.attribArr = [];
    this.dupes = [];
    this.lineOffsets = lineOffsets;
    this.wasClosed = true;
  }

  _indexToPosition(index) {
    const line = this.lineOffsets.findIndex((startIndex) => index < startIndex);
    const column = line === -1 ? index - this.lineOffsets[this.lineOffsets.length - 1] : index - this.lineOffsets[line - 1];
    return [
      (line === -1 ? this.lineOffsets.length : line),
      column + 1
    ];
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

  onattribute(rawName, value) {
    const name = rawName.toLowerCase();
    if (!this.attributes[name]) {
      this.attributes[name] = {
        rawName: rawName,
        value: value
      };
      this.attribArr.push(name);
    } else {
      this.dupes.push(name);
    }
  }

  /* eslint-disable no-underscore-dangle */
  onopentag(name, attribs) {
    super.onopentag(...arguments);

    const element = this._tagStack[this._tagStack.length - 1];
    element.openIndex = this._parser.startIndex;
    if (!this.wasClosed) {
      element.openIndex -= 3;
    }
    this.wasClosed = true;
    element.open = this.htmlText.slice(element.openIndex + 1, this._parser.endIndex);
    element.openLineCol = this._indexToPosition(element.openIndex);
    // remove duplicate data
    // delete element.lineCol;

    element.attribs = this.attributes;
    // element.attribsArr = this.attribArr;
    inputIndices(element.attribs, element.open, element.openIndex);

    this.attribArr
      .sort(function(a, b) {
        return element.attribs[a].nameIndex - element.attribs[b].nameIndex;
      })
      .forEach(function(attrib) {
        const a = element.attribs[attrib];
        a.nameLineCol = this._indexToPosition(a.nameIndex);
        a.valueLineCol = this._indexToPosition(a.valueIndex);
      }, this);

    this.attribArr = [];
    this.attributes = {};

    element.dupes = this.dupes;
    this.dupes = [];
  }

  onclosetag() {
    const element = this._tagStack[this._tagStack.length - 1];

    if (element && !isVoidElement(element.name)) {
      // Mercifully, no whitespace is allowed between < and /
      this.wasClosed = this.htmlText[this._parser.startIndex + 1] === "/";
      element.close = this.wasClosed
        ? this.htmlText.slice(this._parser.startIndex + 2, this._parser.endIndex)
        : "";
      element.closeIndex = this._parser.startIndex;
      if (!this.wasClosed && element.closeIndex === element.openIndex) {
        element.closeIndex += element.open.length + 1;
      }
      element.closeLineCol = this._indexToPosition(element.closeIndex);
    }

    super.onclosetag(...arguments);
  }

  onprocessinginstruction(name, data) {
    // htmlparser2 doesn't normally update the position when processing
    // declarations or processing directives (<!doctype ...> or <?...> elements)
    this._parser._updatePosition(2);
    super.onprocessinginstruction(...arguments);
  }

  _addDomElement(element) {
    if (!this._parser) {
      // TODO: rewrite error msg
      throw new Error("stop being a bone head >.<");
    }
    element.index = this._parser.startIndex;
    if (!this.wasClosed) {
      element.index -= 3;
    }
    element.lineCol = this._indexToPosition(element.index);
    super._addDomElement(...arguments);
  }
  /* eslint-enable no-underscore-dangle */
}

module.exports = Handler;
