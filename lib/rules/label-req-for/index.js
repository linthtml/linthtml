const knife = require("../../knife");

module.exports = {
  name: "label-req-for",
  filter: ["label"],
  on: ["tag"],
  need: "tag",

  idmap: null
};

module.exports.end = function() {
  this.idmap = null;
};

module.exports.lint = function(node, opts, { report }) {
  const hasFor = !!node.attribs.for;
  if (hasFor === false) {
    return report({
      code: this.hasValidChild(node) ? "E019" : "E020",
      position: node.openLineCol
    });
  }

  if (!this.idmap) {
    this.buildIdMap(node);
  }

  const id = node.attribs.for.value;
  const fornodement = this.idmap[id];

  if (!fornodement) {
    // the paired nodement does not exist
    report({
      code: "E021",
      position: node.openLineCol,
      meta: {
        data: {
          id: id
        }
      }
    });
  } else if (!knife.isLabeable(fornodement)) {
    report({
      code: "E022",
      position: node.openLineCol,
      meta: {
        data: {
          id: id
        }
      }
    });
  }
};

module.exports.buildIdMap = function(originnodement) {
  let rnodem = originnodement;
  while (rnodem.parent !== null) {
    rnodem = rnodem.parent;
  }
  while (rnodem.prev !== null) {
    rnodem = rnodem.prev;
  }

  const roots = [];
  while (rnodem !== null) {
    roots.push(rnodem);
    rnodem = rnodem.next;
  }

  const idmap = {};

  roots.forEach(function iteratenodements(nodement) {
    if (nodement.attribs && nodement.attribs.id) {
      const id = nodement.attribs.id.value;

      if (idmap[id] === undefined) {
        idmap[id] = nodement;
      }
    }

    if (nodement.children) {
      nodement.children.forEach(iteratenodements);
    }
  });

  this.idmap = idmap;
};

module.exports.hasValidChild = function(nodement) {
  // test for any nodement to be labeable
  return nodement.children.some(knife.isLabeable);
};
