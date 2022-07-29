import { Node } from "./dom_elements";
import { attribute_has_value, is_tag_node } from "./tags";

// these elements are *labelable elements* according to the HTML spec
const LABELABLE_NODES = [
  "button",
  "input", // if not in the hidden state
  "keygen",
  "meter",
  "output",
  "progress",
  "select",
  "textarea"
];

/**
 * Returns whether or not an html element can be associated with a
 * label element.
 */
export default function is_labelable(node: Node): boolean {
  if (!is_tag_node(node) || !LABELABLE_NODES.includes(node.name)) {
    // element isn't a tag or isn't a labeable element
    return false;
  }

  if (node.name === "input" && attribute_has_value(node, "type", "hidden")) {
    // inputs that are hidden are not labeable elements
    return false;
  }

  // element passed all the tests
  return true;
};
