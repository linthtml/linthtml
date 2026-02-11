import type {
  AnyNode,
  Document,
  Element,
  Text,
  Comment,
  ProcessingInstruction,
  CDATA,
  NodeAttribute
} from "@linthtml/dom-utils";
import { is_void_node } from "@linthtml/dom-utils";
import { ElementType } from "domelementtype";

/**
 * Renders an AST back to HTML string with zero diff from the original source.
 * Uses raw values stored during parsing to preserve exact formatting.
 */
export function render(node: AnyNode): string {
  switch (node.type) {
    case ElementType.Root:
      return render_document(node as Document);
    case ElementType.Tag:
    case ElementType.Script:
    case ElementType.Style:
      return render_element(node as Element);
    case ElementType.Text:
      return render_text(node as Text);
    case ElementType.Comment:
      return render_comment(node as Comment);
    case ElementType.Directive:
      return render_directive(node as ProcessingInstruction);
    case ElementType.CDATA:
      return render_cdata(node as CDATA);
    default:
      return "";
  }
}

/**
 * Renders a Document node by rendering all its children
 */
function render_document(doc: Document): string {
  return doc.children.map((child) => render(child)).join("");
}

/**
 * Renders an Element node using its raw values to preserve exact formatting
 */
function render_element(element: Element): string {
  // Use the raw opening tag if available
  const openTag = element.open?.raw;

  if (!openTag) {
    // Fallback: reconstruct the opening tag
    return render_element_fallback(element);
  }

  // Render children
  const children = element.children.map((child) => render(child)).join("");

  // Use the raw closing tag if available, otherwise generate one if needed
  // For void elements with no children, we can omit the closing tag
  if (is_void_node(element) && element.children.length === 0 && !element.close) {
    return openTag;
  }

  const closeTag = element.close?.raw ?? `</${element.name}>`;

  return `${openTag}${children}${closeTag}`;
}

/**
 * Fallback renderer when raw values are not available
 * Reconstructs the element using attribute raw values
 */
function render_element_fallback(element: Element): string {
  const tagName = element.name;
  const attributes = render_attributes_fallback(element.attributes);

  // Determine if this is a self-closing or void element
  const isVoid = is_void_node(element);

  if (isVoid && element.children.length === 0) {
    // Void element - use self-closing format
    return `<${tagName}${attributes}>`;
  }

  // Regular element with opening and closing tags
  const openTag = `<${tagName}${attributes}>`;
  const children = element.children.map((child) => render(child)).join("");
  const closeTag = `</${tagName}>`;

  return `${openTag}${children}${closeTag}`;
}

/**
 * Renders attributes using their raw values when available
 */
function render_attributes_fallback(attributes: NodeAttribute[]): string {
  if (attributes.length === 0) {
    return "";
  }

  // Build attribute string using raw values
  const parts: string[] = [];

  attributes.forEach((attr) => {
    const name = attr.name.chars;

    if (attr.value?.raw) {
      // Has value with raw text - use it
      const equalSign = attr.equal?.chars ?? "=";
      parts.push(`${name}${equalSign}${attr.value.raw}`);
    } else if (attr.value) {
      // Has value but no raw - reconstruct
      parts.push(`${name}="${attr.value.chars}"`);
    } else {
      // Boolean attribute
      parts.push(name);
    }
  });

  return " " + parts.join(" ");
}

/**
 * Renders a Text node
 */
function render_text(text: Text): string {
  // Text nodes store their content in the data property
  // The raw original text is preserved in the DOM
  return text.data;
}

/**
 * Renders a Comment node
 */
function render_comment(comment: Comment): string {
  return `<!--${comment.data}-->`;
}

/**
 * Renders a ProcessingInstruction (DOCTYPE, etc.)
 */
function render_directive(pi: ProcessingInstruction): string {
  // For directives like DOCTYPE, the data property contains the full content after "<!"
  // e.g., for "<!DOCTYPE html>", name="!doctype", data="!DOCTYPE html"
  // So we render it as "<!" + data + ">"
  return `<${pi.data}>`;
}

/**
 * Renders a CDATA section
 */
function render_cdata(cdata: CDATA): string {
  const content = cdata.children.map((child) => render(child)).join("");
  return `<![CDATA[${content}]]>`;
}

export default render;
