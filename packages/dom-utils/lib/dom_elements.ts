import { NodeWithChildren } from "domhandler";
import { ElementType } from "domelementtype";

// TODO: Add new type or template for CharValue with non empty raw value (like attribute value)
export class CharValue {
  constructor(public chars: string, public loc: Range, public raw?: string) {
    this.chars = chars;
    this.raw = raw;
    this.loc = loc;
  }
}

export class NodeAttribute {
  public type = "attribute";
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
    this.loc = loc;
  }
}

export class Range {
  constructor(public start: Position, public end: Position) {
    this.start = start;
    this.end = end;
  }
}

export class Position {
  constructor(public line: number, public column: number) {
    this.line = line;
    this.column = column;
  }
}

// TODO: Fix type
/* eslint-disable-next-line @typescript-eslint/ban-types */
type Constructor<T = {}> = new (...args: any[]) => T;

type ExtendedNode<T> = new () => T;
interface MyExtendedNode {
  loc: Range;
  open: CharValue;
  close: CharValue | undefined;
}
/** @hidden */
function ExtendedNode<TBase extends Constructor>(
  Base: TBase
): {
  new (...args: any[]): MyExtendedNode;
  prototype: MyExtendedNode;
} & TBase {
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

// Keep in sync with domhandler types

// Change NodeWithChildren type for children
export class Node extends ExtendedNode(NodeWithChildren) {
  parent: NodeWithChildren | null = null;
  children: Node[] = []; // {Node[]}
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
    type: ElementType.Tag | ElementType.Script | ElementType.Style = name === "script"
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

export declare class DataNode extends Node {
  data: string;
  /**
   * @param type The type of the node
   * @param data The content of the data node
   */
  constructor(type: ElementType.Comment | ElementType.Text | ElementType.Directive, data: string);

  get nodeValue(): string;
  set nodeValue(data: string);
}

export declare class Text extends DataNode {
  constructor(data: string);
}
/**
 * Comments within the document.
 */
export declare class Comment extends DataNode {
  constructor(data: string);
}

/**
 * Processing instructions, including doc types.
 */
export declare class ProcessingInstruction extends DataNode {
  name: string;
  constructor(name: string, data: string);
  "x-name"?: string;
  "x-publicId"?: string;
  "x-systemId"?: string;
}
