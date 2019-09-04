var knife = require("../../knife"),
  Issue = require("../../issue");

module.exports = {
  name: "img-req-src",
  on: ["tag"],
  need: "tag",
  filter: ["img"]
};

module.exports.lint = function(element/*, opts*/) {
  return (element.name === "img" && knife.hasNonEmptyAttr(element, "src"))
    ? []
    : new Issue("E014", element.openLineCol);
};
