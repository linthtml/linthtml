module.exports = {
  name: "line-no-trailing-whitespace",
  on: ["line"],
  need: "line"
};

module.exports.lint = function(line, opts, { report }) {
  const index = line.text.search(/[^\S\n\r]+[\n\r]*$/);
  if (index !== -1) {
    report({
      code: "E055",
      position: line.loc
    });
  }
};
