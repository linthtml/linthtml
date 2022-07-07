import { reportFunction, RuleDefinition } from "../../read-config";
import { is_text_node, get_text_lines } from "@linthtml/dom-utils";
import { create_list_value_validator } from "../../validate_option";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "line-end-style";

const formats = {
  cr: /(^|[^\n\r])\r$/,
  lf: /(^|[^\n\r])\n$/,
  crlf: /(^|[^\n\r])\r\n$/
};

// TODO: Check what happen if no format provided
function lint(node: Node, format: "cr" | "lf" | "crlf", { report }: { report: reportFunction }) {
  if (is_text_node(node)) {
    const lines = get_text_lines(node, true).filter(({ text }) => !formats[format].test(text));

    Object.keys(formats)
      .filter((_) => _ !== format)
      .forEach((format) => {
        lines
          .filter(({ text }) => formats[format as "cr" | "lf" | "crlf"].test(text))
          .forEach((line) => {
            const start_line = node.loc.start.line + line.offset;
            const start_column = line.offset === 0 ? node.loc.start.column : 1;
            report({
              code: "E015",
              position: {
                start: {
                  line: start_line,
                  column: 1
                },
                end: {
                  line: start_line,
                  column: start_column + line.text.length
                }
              },
              meta: {
                data: {
                  format
                }
              }
            });
          });
      });
  }
}

export default {
  name: RULE_NAME,
  validateConfig: create_list_value_validator(RULE_NAME, ["cr", "lf", "crlf"], false),
  lint
} as RuleDefinition;
