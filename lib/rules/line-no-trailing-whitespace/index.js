module.exports = {
  name: "line-no-trailing-whitespace",
  on: ["line"],
  need: "line"
};

module.exports.lint = function({ text, loc }, opts, { report }) {
  const index = text.search(/[^\S\n\r]+[\n\r]*$/);
  if (index !== -1) {
    report({
      code: "E055",
      position: {
        start: {
          line: loc.start.line,
          column: index + 1
        },
        end: loc.end
      }
    });
  }
};
