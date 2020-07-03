const { is_text_node } = require("../../knife/tag_utils");
const { get_lines } = require("../../knife/text_node_utils");

module.exports = {
  name: "line-end-style",
  on: ["dom"],
  need: "dom",
  validateConfig(option) {
    if (typeof option !== "string") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected a string got ${typeof option}.`);
    }
    if (/^(cr|lf|crlf)$/.test(option) === false) {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected "cr", "lf" or "crlf" got "${option}".`);
    }
    return option;
  }
};

const formats = {
  cr: /(^|[^\n\r])\r$/,
  lf: /(^|[^\n\r])\n$/,
  crlf: /(^|[^\n\r])\r\n$/
};

module.exports.lint = function(node, opts, { report }) {
  if (is_text_node(node) === false) {
    return;
  }
  const format = opts[this.name];

  let lines = get_lines(node, true);

  lines = lines.filter(({ text }) => !formats[format].test(text));
  Object.keys(formats)
    .filter(_ => _ !== format)
    .forEach(format => {
      lines.filter(({ text }) => formats[format].test(text))
        .forEach(line => {
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
                format: format
              }
            }
          });
        });
    });
};
