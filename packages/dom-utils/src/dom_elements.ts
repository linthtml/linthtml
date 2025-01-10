import { cloneNode } from "domhandler";
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

/**
 * A node that can have children.
 */

export type ParentNode = Document | Element | CDATA;

/**
 * A node that can have a parent.
 */
export type ChildNode =
  | Text
  | Comment
  | ProcessingInstruction
  | Element
  | CDATA
  // `Document` is also used for document fragments, and can be a child node.
  | Document;
export type AnyNode = ParentNode | ChildNode;

/**
 * This object will be used as the prototype for Nodes when creating a
 * DOM-Level-1-compliant structure.
 */
export abstract class Node {
  children: Node[] = []; // {Node[]}

  /** The type of the node. */
  abstract readonly type: ElementType;

  /** Parent of the node */
  parent: ParentNode | null = null;

  /** Previous sibling */
  prev: ChildNode | null = null;

  /** Next sibling */
  next: ChildNode | null = null;

  /** The start index of the node. Requires `withStartIndices` on the handler to be `true. */
  startIndex: number | null = null;

  /** The end index of the node. Requires `withEndIndices` on the handler to be `true. */
  endIndex: number | null = null;

  // Read-only aliases

  /**
   * [DOM spec](https://dom.spec.whatwg.org/#dom-node-nodetype)-compatible
   * node {@link type}.
   */
  abstract readonly nodeType: number;

  // Read-write aliases for properties

  /**
   * Same as {@link parent}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get parentNode(): ParentNode | null {
    return this.parent;
  }

  set parentNode(parent: ParentNode | null) {
    this.parent = parent;
  }

  /**
   * Same as {@link prev}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get previousSibling(): ChildNode | null {
    return this.prev;
  }

  set previousSibling(prev: ChildNode | null) {
    this.prev = prev;
  }

  /**
   * Same as {@link next}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get nextSibling(): ChildNode | null {
    return this.next;
  }

  set nextSibling(next: ChildNode | null) {
    this.next = next;
  }

  /**
   * Clone this node, and optionally its children.
   *
   * @param recursive Clone child nodes as well.
   * @returns A clone of the node.
   */
  cloneNode<T extends Node>(this: T, recursive = false): T {
    // @ts-expect-error
    return cloneNode(this, recursive);
  }

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
}

/**
 * A node that contains some data.
 */
export abstract class DataNode extends Node {
  /**
   * @param data The content of the data node
   */
  constructor(public data: string) {
    super();
  }

  /**
   * Same as {@link data}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get nodeValue(): string {
    return this.data;
  }

  set nodeValue(data: string) {
    this.data = data;
  }
}

/**
 * Text within the document.
 */
export class Text extends DataNode {
  type: ElementType.Text = ElementType.Text;

  get nodeType(): 3 {
    return 3;
  }
}

/**
 * Comments within the document.
 */
export class Comment extends DataNode {
  type: ElementType.Comment = ElementType.Comment;

  get nodeType(): 8 {
    return 8;
  }
}

/**
 * Processing instructions, including doc types.
 */
export class ProcessingInstruction extends DataNode {
  type: ElementType.Directive = ElementType.Directive;

  constructor(
    public name: string,
    data: string
  ) {
    super(data);
  }

  get nodeType(): 1 {
    return 1;
  }

  /** If this is a doctype, the document type name (parse5 only). */
  "x-name"?: string;
  /** If this is a doctype, the document type public identifier (parse5 only). */
  "x-publicId"?: string;
  /** If this is a doctype, the document type system identifier (parse5 only). */
  "x-systemId"?: string;
}

/**
 * A node that can have children.
 */
export abstract class NodeWithChildren extends Node {
  /**
   * @param children Children of the node. Only certain node types can have children.
   */
  constructor(public children: ChildNode[]) {
    super();
  }

  // Aliases
  /** First child of the node. */
  get firstChild(): ChildNode | null {
    return this.children[0] ?? null;
  }

  /** Last child of the node. */
  get lastChild(): ChildNode | null {
    return this.children.length > 0 ? this.children[this.children.length - 1] : null;
  }

  /**
   * Same as {@link children}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get childNodes(): ChildNode[] {
    return this.children;
  }

  set childNodes(children: ChildNode[]) {
    this.children = children;
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
}

/**
 * CDATA nodes.
 */
export class CDATA extends NodeWithChildren {
  type: ElementType.CDATA = ElementType.CDATA;

  get nodeType(): 4 {
    return 4;
  }
}

/**
 * The root node of the document.
 */
export class Document extends NodeWithChildren {
  type: ElementType.Root = ElementType.Root;

  get nodeType(): 9 {
    return 9;
  }

  /** [Document mode](https://dom.spec.whatwg.org/#concept-document-limited-quirks) (parse5 only). */
  "x-mode"?: "no-quirks" | "quirks" | "limited-quirks";
}

/**
 * An element within the DOM.
 */
export class Element extends NodeWithChildren {
  /**
   * @param name Name of the tag, eg. `div`, `span`.
   * @param attribs Object mapping attribute names to attribute values.
   * @param children Children of the node.
   */
  constructor(
    public name: string,
    public attributes: NodeAttribute[],
    children: ChildNode[] = [],
    public type: ElementType.Tag | ElementType.Script | ElementType.Style = name === "script"
      ? ElementType.Script
      : name === "style"
        ? ElementType.Style
        : ElementType.Tag
  ) {
    super(children);
  }

  get nodeType(): 1 {
    return 1;
  }

  // DOM Level 1 aliases

  /**
   * Same as {@link name}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get tagName(): string {
    return this.name;
  }

  set tagName(name: string) {
    this.name = name;
  }

  /** Element namespace (parse5 only). */
  namespace?: string;
  /** Element attribute namespaces (parse5 only). */
  "x-attribsNamespace"?: Record<string, string>;
  /** Element attribute namespace-related prefixes (parse5 only). */
  "x-attribsPrefix"?: Record<string, string>;
}
