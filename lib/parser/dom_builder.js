const { DomHandler } = require("htmlparser2");
const knife = require("../knife");

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

    const ele = this._tagStack[this._tagStack.length - 1];
    ele.openIndex = this._parser.startIndex;
    if (!this.wasClosed) {
      ele.openIndex -= 3;
    }
    this.wasClosed = true;
    ele.open = this.htmlText.slice(ele.openIndex + 1, this._parser.endIndex);
    ele.openLineCol = this._indexToPosition(ele.openIndex);
    // remove duplicate data
    // delete ele.lineCol;

    ele.attribs = this.attributes;
    // ele.attribsArr = this.attribArr;
    knife.inputIndices(ele.attribs, ele.open, ele.openIndex);

    this.attribArr
      .sort(function(a, b) {
        return ele.attribs[a].nameIndex - ele.attribs[b].nameIndex;
      })
      .forEach(function(attrib) {
        const a = ele.attribs[attrib];
        a.nameLineCol = this._indexToPosition(a.nameIndex);
        a.valueLineCol = this._indexToPosition(a.valueIndex);
      }, this);

    this.attribArr = [];
    this.attributes = {};

    ele.dupes = this.dupes;
    this.dupes = [];
  }

  onclosetag() {
    const ele = this._tagStack[this._tagStack.length - 1];

    if (ele && !knife.isVoidElement(ele.name)) {
      // Mercifully, no whitespace is allowed between < and /
      this.wasClosed = this.htmlText[this._parser.startIndex + 1] === "/";
      ele.close = this.wasClosed
        ? this.htmlText.slice(this._parser.startIndex + 2, this._parser.endIndex)
        : "";
      ele.closeIndex = this._parser.startIndex;
      if (!this.wasClosed && ele.closeIndex === ele.openIndex) {
        ele.closeIndex += ele.open.length + 1;
      }
      ele.closeLineCol = this._indexToPosition(ele.closeIndex);
    }

    super.onclosetag(...arguments);
  }

  onprocessinginstruction(name, data) {
    // htmlparser2 doesn't normally update the position when processing
    // declarations or processing directives (<!doctype ...> or <?...> elements)
    this._parser._updatePosition(2);
    super.onprocessinginstruction(...arguments);
  }

  _addDomElement(ele) {
    if (!this._parser) {
      // TODO: rewrite error msg
      throw new Error("stop being a bone head >.<");
    }
    ele.index = this._parser.startIndex;
    if (!this.wasClosed) {
      ele.index -= 3;
    }
    ele.lineCol = this._indexToPosition(ele.index);
    super._addDomElement(...arguments);
  }
  /* eslint-enable no-underscore-dangle */
}

module.exports = Handler;
