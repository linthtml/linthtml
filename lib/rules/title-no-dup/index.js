var Issue = require("../../issue");

module.exports = {
  name: "title-no-dup",
  on: ["title"],
  desc: "If set, the `<title>` tag must not appear twice in the head."
};

module.exports.lint = function(titles/*, opts*/) {
  
  return titles.length <= 1
    ? []
    : titles.slice(1).map(title => new Issue("E028", title.openLineCol, { num: titles.length }));
};
