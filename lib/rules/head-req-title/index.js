var Issue = require("../../issue");

module.exports = {
  name: "head-req-title",
  on: ["tag"],
  need: "tag",
  filter: ["head"]
};

module.exports.lint = function(head/*, opts*/) {
 const titles = head.children.filter(child => child.name === "title");
 return titles.some(function(t) {
   return t.children.length > 0;
 })
   ? []
   : new Issue("E027", head.openLineCol);
};
