var Issue = require("../../issue");

module.exports = {
  name: "title-no-dup",
  on: ["title"]
};

module.exports.lint = function(titles/*, opts*/) {
  
  return titles.length <= 1
    ? []
    : titles.slice(1).map(title => new Issue("E028", title.openLineCol, { num: titles.length }));
};
