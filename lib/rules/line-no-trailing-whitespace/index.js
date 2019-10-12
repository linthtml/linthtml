module.exports = {
  name: "line-no-trailing-whitespace",
  on: ["line"],
  need: "line"
};

module.exports.lint = function(line, opts, { report }) {
  const i = line.text.search(/[^\S\n\r]+[\n\r]*$/);
  if (i !== -1) {
    report({
      code: "E055",
      position: [line.line, i]
    });
  }
};
