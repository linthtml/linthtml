var Issue = require("../../issue");

module.exports = {
  name: "tag-name-lowercase",
  on: ["tag"],
  need: "tag"
};

module.exports.lint = function(element/*, opts*/) {
  return /[A-Z]/.test(element.name)
    ? new Issue("E017", element.openLineCol)
    : [];
};
