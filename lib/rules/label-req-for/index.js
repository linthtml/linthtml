const knife = require("../../knife");
const Issue = require("../../issue");

module.exports = {
  name: "label-req-for",
  filter: ["label"],
  on: ["tag"],

  idmap: null
};

module.exports.end = function() {
  this.idmap = null;
};

module.exports.lint = function(ele) {
  const hasFor = ele.attribs.hasOwnProperty("for");

  if (hasFor === false && this.hasValidChild(ele) === true) {
    return new Issue("E019", ele.openLineCol);
  } else if (hasFor === false) {
    return new Issue("E020", ele.openLineCol);
  }

  if (hasFor) {
    if (!this.idmap) {
      this.buildIdMap(ele);
    }

    var id = ele.attribs["for"].value,
      forElement = this.idmap[id];

    if (!forElement) {
      // the paired element does not exist
      return new Issue("E021", ele.openLineCol, { id: id });
    } else if (!knife.isLabeable(forElement)) {
      return new Issue("E022", ele.openLineCol, { id: id });
    }
  }

  return [];
};

module.exports.buildIdMap = function(originElement) {
  var rElem = originElement;
  while (rElem.parent !== null) {
    rElem = rElem.parent;
  }
  while (rElem.prev !== null) {
    rElem = rElem.prev;
  }

  var roots = [];
  while (rElem !== null) {
    roots.push(rElem);
    rElem = rElem.next;
  }

  var idmap = {};

  roots.forEach(function iterateElements(element) {
    if (element.attribs && element.attribs.id) {
      var id = element.attribs.id.value;

      if (!idmap.hasOwnProperty(id)) {
        idmap[id] = element;
      }
    }

    if (element.children) {
      element.children.forEach(iterateElements);
    }
  });

  this.idmap = idmap;
};

module.exports.hasValidChild = function(element) {
  // test for any element to be labeable
  return element.children.some(knife.isLabeable);
};
