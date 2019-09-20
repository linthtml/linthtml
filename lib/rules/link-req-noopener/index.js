const Issue = require("../../issue");

module.exports = {
  name: "link-req-noopener",
  on: ["tag"],
  need: "tag",
  filter: ["a"]
};

module.exports.lint = function(element/*, opts*/) {
  function getVal(a/*, value*/) {
    return a && a.value;
  }

  var noopen = /(^| )(noopener|noreferrer)( |$)/;

  var attrs = element.attribs;
  if (getVal(attrs.target) === "_blank" && !noopen.test(getVal(attrs.rel))) {
    return new Issue("E058", element.openLineCol);
  }
  return [];
};


// <base target="_blank" />
// https://html.com/attributes/base-target/
