// TODO: Use custom one from dom_elements
import { Text } from "domhandler";
import { Node } from "./dom_elements";
import { is_text_node } from "./tags";

export interface TextLine {
  text: string;
  offset: number;
}

/**
 * Extract all text lines from a text node.
 *
 * For example, given the following HTML:
 * ```html
 *  <p>
 *    First line
 *    Second line
 *    Third line
 *  </p>
 * ```
 * The HTML parser will return a Text node containing `First line`, `Second line` and `Third line`
 * This function will extract the text for the node and return the following array
 * ```js
 *  [
 *    { offset: 0, text: 'First line' },
 *    { offset: 1: text: 'Second line' },
 *    { offset: 2, text: 'Third line' }
 *  ]
 * ```
 */
export function get_text_lines(node: Text, include_EOL = false): TextLine[] {
  const { data } = node;
  const R = /(\r\n|\r|\n)/g;
  let match;
  const lines = [];
  let previous_index = 0;
  let offset = 0;
  while ((match = R.exec(data)) !== null) {
    const EOL = match[0];
    const extra_cut = include_EOL ? EOL.length : 0;
    lines.push({
      offset: offset++,
      text: data.slice(previous_index, match.index + extra_cut)
    });
    previous_index = match.index + EOL.length;
  }
  if (previous_index !== data.length) {
    lines.push({
      offset,
      text: data.slice(previous_index)
    });
  }
  return lines;
}

/**
 * Check if a text node is only a node containing a newline char
 */
export function is_newline_only(node: Node): boolean {
  if (!is_text_node(node)) {
    return false;
  }
  const text = node.data || "";
  return /^([\n\r]+[\t ]*)+$/.test(text);
}
