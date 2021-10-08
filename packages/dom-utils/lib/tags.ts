import { ElementType } from "domelementtype";
import { Text } from "domhandler";
import { types } from "util";
import { CharValue, Element, Node, NodeAttribute } from "./dom_elements";

const { isRegExp } = types;

function is_self_closing(node: Element): boolean {
  const openRaw = node.open.raw as string; // Force raw presence for Element?
  return /\/>$/.test(openRaw);
}

function has_attribute(node: Element, attribute_name: string): boolean {
  return is_tag_node(node)
    ? node.attributes.some(({ name }) => name.chars.toLowerCase() === attribute_name)
    : false;
}

/**
 * Check whether the given tag has a non-empty attribute with the given
 * name. Count "" as a non-empty attribute value only if optional
 * parameter allow_null is true
 */
function has_non_empty_attribute(node: Element, attribute_name: string, allow_null: boolean = false): boolean {
  const attribute = node.attributes.find(
    ({ name }) => name.chars.toLowerCase() === attribute_name
  );
  return !!attribute && (allow_null || !!attribute.value && attribute.value.chars.length > 0);
}

function get_attribute(node: Element, attribute_name: string): NodeAttribute | null {
  if (has_attribute(node, attribute_name)) {
    return node.attributes
      .find(({ name }) => name.chars.toLowerCase() === attribute_name) as NodeAttribute;
  }
  return null;
}

function attribute_value(node: Element, attribute_name: string): CharValue | null {
  const attribute = get_attribute(node, attribute_name);
  return attribute?.value ?? null;
}

function attribute_has_value(node: Element, attribute_name: string, value_to_check: string): boolean {
  const value = attribute_value(node, attribute_name);
  if (value) {
    return isRegExp(value_to_check)
      ? value_to_check.test(value.chars)
      : value.chars === value_to_check;
  }
  return false;
}


function is_tag_node(node: Node): node is Element {
  return [
    ElementType.Tag,
    ElementType.Style,
    ElementType.Script
  ].indexOf(node.type) !== -1;
}

// Todo check is current node text have `.loc` property if yes then create class Text_Node in dom_element.ts
// @ts-ignore
function is_text_node(node: Node): node is Text {
  return node.type === ElementType.Text;
}


function get_classes(class_attribute: CharValue): string[] {
  const classes = class_attribute ?.chars ?? "";
  return classes
    .trim()
    .split(/\s+/);
}


function node_tag_name(node: Node): string {
  switch (node.type) {
    case ElementType.Text:
      return "Text Node"; // get text node content but truncate ?
    case ElementType.Comment:
      return "Comment";
    default:
      // TODO: Check function with other types (CDATA, doctype...)
      return (node as Element).name;
  }
}

function has_parent_node(node: Node): boolean {
  // root node is not a "normal" node
  return !!node.parent && node.parent.type !== "root";
}

export {
  has_non_empty_attribute,
  attribute_value,
  is_tag_node,
  is_text_node,
  is_self_closing,
  get_attribute,
  has_attribute,
  attribute_has_value,
  get_classes,
  node_tag_name,
  has_parent_node
};
