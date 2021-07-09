const { is_text_node } = require("../../knife/tag_utils");
const { get_lines } = require("../../knife/text_node_utils");
const { create_list_value_validator } = require("../../validate_option");

const RULE_NAME = "line-end-style";

const formats = {
  cr: /(^|[^\n\r])\r$/,
  lf: /(^|[^\n\r])\n$/,
  crlf: /(^|[^\n\r])\r\n$/
};

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} format
 * @param {*} param2
 */
function lint(node, format, { report }) {
  if (is_text_node(node) === false) {
    return;
  }

  let lines = get_lines(node, true);

  lines = lines.filter(({ text }) => !formats[format].test(text));
  Object.keys(formats)
    .filter(_ => _ !== format)
    .forEach(format => {
      lines.filter(({ text }) => formats[format].test(text))
        .forEach(line => {
          const start_line = node.loc.start.line + line.offset;
          const start_column = line.offset === 0
            ? node.loc.start.column
            : 1;
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

module.exports = {
  name: RULE_NAME,
  validateConfig: create_list_value_validator(["cr", "lf", "crlf"], false),
  lint
};
