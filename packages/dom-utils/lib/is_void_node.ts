import { Element } from "./dom_elements";

const VOID_NODES = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "menuitem",
  "meta",
  "param",
  "source",
  "track",
  "wbr",

  // common self closing svg elements
  "path",
  "circle",
  "ellipse",
  "line",
  "rect",
  "use",
  "stop",
  "polyline",
  "polygon"
];

/**
 * Check if a node is a void element. A void element is an element which can't have any content
 * @see [HTML spec](https://html.spec.whatwg.org/multipage/syntax.html#void-elements)
 */
export function is_void_node(node: Element): boolean {
  return VOID_NODES.indexOf(node.name.toLowerCase()) !== -1;
}
