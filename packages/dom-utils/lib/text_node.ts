// TODO: Use custom one from dom_elements
import { Text } from "domhandler";
import { Node } from "./dom_elements";
import { is_text_node } from "./tags";

export type TextLine = {
 text: string;
 offset: number;
};

export function get_lines(node: Text, include_EOL = false): TextLine[] {
  const { data } = node;
  const R = /(\r\n|\r|\n)/g;
  let match;
  const lines = [];
  let previous_index = 0;
  let offset = 0;
  while ((match = R.exec(data)) !== null) {
    const EOL = match[0];
    const extra_cut = include_EOL
      ? EOL.length
      : 0;
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

export function is_newline_only(node: Node): boolean {
  if (!is_text_node(node)) {
    return false;
  }
  const text = node.data || "";
  return /^([\n\r]+[\t ]*)+$/.test(text);
}
