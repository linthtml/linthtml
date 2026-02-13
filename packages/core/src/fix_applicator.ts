import type { Position } from "@linthtml/dom-utils";
import type { Fix } from "./issue.js";

function generate_line_offsets(html: string) {
  const line_offsets = [0];

  let match;
  const R = /(\r\n|\r|\n)/g;
  while ((match = R.exec(html)) !== null) {
    const EOL = match[0];
    line_offsets.push(match.index + EOL.length);
  }

  return line_offsets;
}

function position_to_offset(line_offsets: number[], pos: Position): number {
  // line_offsets[0] is offset of line 1
  // pos.line is 1-indexed, so line_offsets[pos.line - 1] gives start of that line
  const line_start = line_offsets[pos.line - 1];
  return line_start + (pos.column - 1); // column is 1-indexed
}

// Internal type with offsets for efficient fix application
type FixWithOffsets = Fix & {
  start_offset: number;
  end_offset: number;
};

function is_overlapping(range: FixWithOffsets, applied: FixWithOffsets[]): boolean {
  return applied.some((applied_range) => ranges_overlap(range, applied_range));
}

function ranges_overlap(a: FixWithOffsets, b: FixWithOffsets): boolean {
  // Check if range a overlaps with range b using offsets
  return a.start_offset < b.end_offset && b.start_offset < a.end_offset;
}

export function apply_fixes(html: string, fixes: Fix[]) {
  // Generate line offsets once from original HTML
  const line_offsets = generate_line_offsets(html);

  // Convert all fixes to use offsets (keeps loc property for API)
  const fixes_with_offsets: FixWithOffsets[] = fixes.map((fix) => ({
    ...fix,
    start_offset: position_to_offset(line_offsets, fix.loc.start),
    end_offset: position_to_offset(line_offsets, fix.loc.end)
  }));

  // Sort by end offset (descending) - fixes later in the file first
  // This way earlier offsets aren't affected when we apply fixes
  const sorted = fixes_with_offsets.sort((a, b) => b.end_offset - a.end_offset);

  let result = html;
  const applied: FixWithOffsets[] = [];

  for (const fix of sorted) {
    if (is_overlapping(fix, applied)) {
      continue; // Skip overlapping (ESLint behavior)
    }

    // Apply fix using offsets
    result = result.slice(0, fix.start_offset) + fix.text + result.slice(fix.end_offset);

    applied.push(fix);
  }

  return result;
}
