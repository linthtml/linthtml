var Issue = require("../../issue");

module.exports = {
  name: "line-no-trailing-whitespace",
  on: ["line"]
};

module.exports.lint = function(line/*, opts*/) {
  var i = line.text.search(/[^\S\n\r]+[\n\r]*$/);
  return i === -1 ? [] : new Issue("E055", [line.line, i]);
};
