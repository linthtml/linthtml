const { is_labelable } = require("../../knife");
const { is_tag_node, has_attribute, attribute_value } = require("../../knife/tag_utils");

const RULE_NAME = "label-req-for";

function buildIdMap(originnodement) {
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

  function iteratenodements(nodement) {
    if (is_tag_node(nodement) && has_attribute(nodement, "id")) {
      const id = attribute_value(nodement, "id").chars;

      if (idmap[id] === undefined) {
        idmap[id] = nodement;
      }
    }

    if (nodement.children) {
      nodement.children.forEach(iteratenodements);
    }
  }
  roots.forEach(iteratenodements);

  this.idmap = idmap;
}

function hasValidChild(nodement) {
  // test for any nodement to be labeable
  return nodement.children.some(is_labelable);
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false || node.name !== "label") {
    return;
  }
  if (has_attribute(node, "for") === false) {
    return report({
      // Report only "E020" ?
      code: hasValidChild(node) ? "E019" : "E020",
      position: node.open.loc
    });
  }

  if (!this.idmap) {
    this.buildIdMap(node);
  }

  const id = attribute_value(node, "for").chars;
  const fornodement = this.idmap[id];

  if (!fornodement) {
    // the paired nodement does not exist
    report({
      code: "E021",
      position: node.open.loc,
      meta: {
        data: {
          id: id
        }
      }
    });
  } else if (!is_labelable(fornodement)) {
    report({
      code: "E022",
      position: node.open.loc,
      meta: {
        data: {
          id: id
        }
      }
    });
  }
}

function end() {
  this.idmap = null;
}

module.exports = {
  name: RULE_NAME,
  lint,
  buildIdMap,
  end,

  idmap: null // needed?
};
