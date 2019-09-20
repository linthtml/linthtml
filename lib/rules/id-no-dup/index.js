var Issue = require("../../issue");

module.exports = {
  name: "id-no-dup",
  table: {},
  on: ["tag"],
  need: "tag"
};

module.exports.end = function() {
  // wipe previous table
  this.table = {};
};

module.exports.lint = function(element/*, opts*/) {
  // don't process the element if it doesn't have an id
  if (element.attribs.id === null || element.attribs.id === undefined) {
    return [];
  }

  var id = element.attribs.id;
  // TODO: Remove after `raw-ignore-text` refacto
  if (/^¤+$/.test(id.value)) {
    return [];
  }
  // if we haven't seen the id before, remember it
  // and pass the element
  if (this.table[id.value] === undefined) {
    this.table[id.value] = element;
    return [];
  }

  // element has a duplicate id
  return new Issue("E012", id.valueLineCol, { id: id.value });
};
