import { DomHandler } from "htmlparser2";
import { Document, NodeAttribute, Node } from "@linthtml/dom-utils";
export default class Handler extends DomHandler {
    /** The elements of the DOM */
    dom: Node[];
    /** The root element for the DOM */
    root: Document;
    tagStack: Node[];
    private attributes;
    private lineOffsets;
    constructor(lineOffsets: number[]);
    get _parser(): any;
    get buffer(): any;
    private _indexToPosition;
    __createAttributeNode(name: string, attribute_value: string): NodeAttribute;
    onattribute(name: string, value: string): void;
    onopentag(name: string): void;
    onclosetag(): void;
    addNode(node: Node): void;
}
//# sourceMappingURL=dom_builder.d.ts.map