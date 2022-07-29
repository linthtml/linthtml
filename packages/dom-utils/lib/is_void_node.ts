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

export default function is_void_node({ name }: Element): boolean {
  return VOID_NODES.indexOf(name.toLowerCase()) !== -1;
}
