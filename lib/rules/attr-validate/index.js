module.exports = {
  name: "attr-validate",
  on: ["tag"],
  need: "tag"
};

module.exports.lint = function(element, opts, { report }) {
  /* eslint-disable-next-line no-useless-escape */
  const attrRegex = /^\s*([^ "'>=\^]+(\s*=\s*(("[^"]*")|('[^']*')|([^ \t\n"']+)))?\s+)*$/;
  const open = element.open.slice(element.name.length).replace(/\/$/, "");
  if (attrRegex.test(open + " ") === false) {
    report({
      code: "E049",
      position: element.openLineCol
    });
  }
};
