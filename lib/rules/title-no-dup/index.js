var Issue = require("../../issue");

module.exports = {
  name: "title-no-dup",
  on: ["tag"],
  need: "tag",
  filter: ["head"]
};

module.exports.lint = function(head/*, opts*/) {
 const titles = head.children.filter(child => child.name === "title");
 
 return titles.length <= 1
   ? []
   : titles.slice(1).map(title => new Issue("E028", title.openLineCol, { num: titles.length }));
};
