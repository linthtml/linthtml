import { NodeWithChildren } from "domhandler";
import { ElementType } from "domelementtype";

// TODO: Add new type or template for CharValue with non empty raw value (like attribute value)
/**
 * Low level object that contains a string and it's position in a document.
 *
 * Can be used to "describe" the key of an HTML attribute, the text corresponding to a tag opening tag (`<[span]`), the content of HTML attribute...
 */
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

/**
 * An HTML attribute with the name, equal and string value
 */
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

/**
 * Start and end positions of an element in a document
 */
export class Range {
  constructor(
    public start: Position,
    public end: Position
  ) {
    this.start = start;
    this.end = end;
  }
}

/**
 * The position of element in a document
 */
export class Position {
  constructor(
    public line: number,
    public column: number
  ) {
    this.line = line;
    this.column = column;
  }
}

// TODO: Fix type
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
type Constructor<T = {}> = new (...args: any[]) => T;

type ExtendedNode<T> = new () => T;
interface MyExtendedNode {
  loc: Range;
  open: CharValue;
  close: CharValue | undefined;
}
/** @hidden */
// eslint-disable-next-line @typescript-eslint/no-redeclare
function ExtendedNode<TBase extends Constructor>(
  Base: TBase
): {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  new (...args: any[]): MyExtendedNode;
  prototype: MyExtendedNode;
} & TBase {
  return class TExtractor extends Base {
    // @ts-expect-error Ignore
    private _loc: Range;
    /**
     * Node position in document
     */
    get loc() {
      return this._loc;
    }

    set loc(value) {
      this._loc = value;
    }

    // @ts-expect-error Ignore
    private _open: CharValue;
    /**
     * Node open tag details
     */
    get open() {
      return this._open;
    }

    set open(value) {
      this._open = value;
    }

    private _close: CharValue | undefined = undefined;
    /**
     * Node close tag details.
     * _Can be null for self closing tag_
     */
    get close() {
      return this._close;
    }

    set close(value) {
      this._close = value;
    }
  };
}

// TODO Keep in sync with domhandler types
// TODO Change NodeWithChildren type for children
/**
 * The node element extends the one from Domhandler to add some extra properties ({@link https://domhandler.js.org/classes/Node.html})
 */
export class Node extends ExtendedNode(NodeWithChildren) {
  parent: NodeWithChildren | null = null;
  children: Node[] = []; // {Node[]}
}
/**
 * An element within the DOM.
 */
export class Element extends Node {
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
/**
 * The DataNode element extends the one from Domhandler to add some extra properties ({@link https://domhandler.js.org/classes/DataNode.html})
 */
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

/**
 * Text within the document.
 * The Text element extends the one from Domhandler to add some extra properties ({@link https://domhandler.js.org/classes/Text.html})
 */
export declare class Text extends DataNode {
  constructor(data: string);
}
/**
 * Comments within the document.
 *
 * The Comment element extends the one from Domhandler to add some extra properties ({@link https://domhandler.js.org/classes/Comment.html})
 */
export declare class Comment extends DataNode {
  constructor(data: string);
}

/**
 * Processing instructions, including doc types.
 *
 * The ProcessingInstruction element extends the one from Domhandler to add some extra properties ({@link https://domhandler.js.org/classes/ProcessingInstruction.html})
 */
export declare class ProcessingInstruction extends DataNode {
  name: string;
  constructor(name: string, data: string);
  "x-name"?: string;
  "x-publicId"?: string;
  "x-systemId"?: string;
}
