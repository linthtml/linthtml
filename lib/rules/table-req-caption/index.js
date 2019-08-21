var Issue = require("../../issue");

module.exports = {
  name: "table-req-caption",
  on: ["tag"],
  filter: ["table"]
};

module.exports.lint = function(ele/*, opts*/) {
  return ele.children.some(function(c) {
    return c.name === "caption";
  })
    ? []
    : new Issue("E031", ele.openLineCol);
};
