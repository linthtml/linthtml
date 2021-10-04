import { Parser } from "htmlparser2";
import DomBuilder from "./dom_builder";
import { NodeWithChildren, Element as _Element } from "domhandler";
import { ElementType } from "domelementtype";

export class CharValue {
  constructor(
    public chars: string,
    public loc: Range,
    public raw?: string
  ) {
    this.chars = chars;
    this.raw = raw;
    this.loc = loc;
  }
}

export class NodeAttribute {
  public type = 'attribute';
  constructor(
    public name: CharValue,
    public loc: Range,
    public index: number,
    public equal: CharValue | null = null,
    public value: CharValue | null = null
  ) {
    this.name = name;
    this.index = index;
    this.value = value;
    this.equal = equal;
    this.loc = loc ;
  }
}

export class Range {
  constructor(
    public start: Position,
    public end: Position
  ) {
    this.start = start;
    this.end = end;
   }
}

export class Position {
  constructor(
    public line: number,
    public column: number
  ) {
    this.line = line;
    this.column = column;
  }
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function ExtendedNode<TBase extends Constructor>(Base: TBase) {
  return class TExtractor extends Base {
    // @ts-ignore
    private _loc: Range;
    get loc() {
      return this._loc;
    }
    set loc(value) {
      this._loc = value;
    }
    // @ts-ignore
    private _open: CharValue;
    get open() {
      return this._open;
    }
    set open(value) {
      this._open = value;
    }
    private _close: CharValue | undefined = undefined;
    get close() {
      return this._close;
    }
    set close(value) {
      this._close = value;
    }
  };
}


// Change NodeWithChildren type for children
export class Node extends ExtendedNode(NodeWithChildren) {
  parent: NodeWithChildren | null = null;
  children: Node[] = [];//{Node[]} 
}
/**
 * An element within the DOM.
 */
export class Element extends Node {
  /**
   * @param name Name of the tag, eg. `div`, `span`.
   * @param attribs Object mapping attribute names to attribute values.
   * @param children Children of the node.
   */
  constructor(
      public name: string,
      public attributes: NodeAttribute[],
      children: Node[] = [],
      type:
          | ElementType.Tag
          | ElementType.Script
          | ElementType.Style = name === "script"
          ? ElementType.Script
          : name === "style"
          ? ElementType.Style
          : ElementType.Tag
  ) {
      super(type, children);
  }

  // DOM Level 1 aliases
  get tagName(): string {
      return this.name;
  }

  set tagName(name: string) {
      this.name = name;
  }

  "x-attribsNamespace"?: Record<string, string>;
  "x-attribsPrefix"?: Record<string, string>;

  // TODO: Bring back namespace and prefix?
  // get attributes(): NodeAttribute[] {
    // return this._attributes;
    // return Object.keys(this.attribs).map((name) => ({
    //     name,
    //     value: this.attribs[name],
    //     namespace: this["x-attribsNamespace"]?.[name],
    //     prefix: this["x-attribsPrefix"]?.[name],
    // }));
  // }
}

/**
 * The root node of the document.
 */
export class Document extends Node {
  constructor(children: Node[]) {
      super(ElementType.Root, children);
  }

  "x-mode"?: "no-quirks" | "quirks" | "limited-quirks";
}

/**
 * Parse an HTML text and return an AST tree
 *
 * @param {string} htmlText
 * @returns {Node{}}
 */
export default function parse(htmlText: string): Document {
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
