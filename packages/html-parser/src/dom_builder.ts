import { DomHandler, ElementType } from "htmlparser2";
import type {
  ChildNode,
  ParentNode
  // TODO find a way to have /dom_elements
} from "@linthtml/dom-utils";
import {
  is_void_node,
  CharValue,
  Document,
  Element,
  NodeAttribute,
  Position,
  Range
  // TODO find a way to have /dom_elements
} from "@linthtml/dom-utils";
export default class Handler extends DomHandler {
  /** The elements of the DOM */
  // @ts-expect-error Will work
  public dom: ChildNode[] = [];
  /** The root element for the DOM */
  // @ts-expect-error Will work
  public root = new Document(this.dom);
  // @ts-expect-error Will work
  public tagStack: ParentNode[];

  private attributes: NodeAttribute[];
  private lineOffsets: number[];

  constructor(lineOffsets: number[]) {
    super(() => {}, {
      withStartIndices: true,
      withEndIndices: true
    });
    this.attributes = [];
    this.lineOffsets = lineOffsets;
    this.tagStack = [this.root];
  }

  get _parser() {
    // @ts-expect-error Trick to avoid having to use ts-expect-error in many places
    return this.parser;
  }

  get buffer() {
    return this._parser.tokenizer.buffer;
  }

  private _indexToPosition(index: number): Position {
    const line = this.lineOffsets.findIndex((startIndex) => index < startIndex);
    const column =
      line === -1 ? index - this.lineOffsets[this.lineOffsets.length - 1] : index - this.lineOffsets[line - 1];
    return new Position(line === -1 ? this.lineOffsets.length : line, column + 1);
  }

  __createAttributeNode(name: string, attribute_value: string): NodeAttribute {
    let equal: CharValue | null = null;
    let value: CharValue | null = null;
    const start: number = this._parser.startIndex; // Use this.startIndex instead (since htmlparser 7.1?)
    let end = this._parser.endIndex;

    const namePosition = {
      start: this._indexToPosition(start),
      end: this._indexToPosition(start + name.length)
    };

    const raw = this.buffer.slice(start + name.length, end);
    const match = raw.match(/\s*=\s*/);
    const rawEqValue = match ? match[0] : null;
    if (rawEqValue) {
      const loc = new Range(namePosition.end, this._indexToPosition(start + name.length + rawEqValue.length));
      equal = new CharValue(rawEqValue, loc);
    }
    if (attribute_value) {
      const rawValue = raw.slice(rawEqValue.length);
      const loc = new Range(this._indexToPosition(start + name.length + rawEqValue.length), this._indexToPosition(end));
      // remove extra spaces newline? (attribute_value)
      value = new CharValue(attribute_value, loc, rawValue);
    } else {
      end = start + name.length;
    }

    return new NodeAttribute(
      new CharValue(name, namePosition),
      {
        start: this._indexToPosition(start),
        end: this._indexToPosition(end)
      },
      start,
      equal,
      value
    );
  }

  // TODO: Use quote?
  onattribute(name: string, value: string /*, quote?: string | undefined | null */): void {
    const attribute = this.__createAttributeNode(name, value);
    this.attributes.push(attribute);
  }

  onopentag(name: string /* , attribs: { [key: string]: string } */): void {
    // @ts-expect-error This options is marked as private but still usage here
    const type = this.options.xmlMode ? ElementType.Tag : undefined;
    const node = new Element(name, this.attributes, undefined, type);
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
    // fail
    // console.log(node)
    if (node && !is_void_node(node as Element)) {
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

  // @ts-expect-error Will work
  addNode(node: ChildNode) {
    // @ts-expect-error Will work
    super.addNode(node);
    node.loc = {
      start: this._indexToPosition(node.startIndex as number),
      end: this._indexToPosition((node.endIndex as number) + 1)
    };
  }
}
