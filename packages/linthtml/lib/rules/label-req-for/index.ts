import { reportFunction, RuleDefinition } from "../../read-config";
import { is_labelable, is_tag_node, has_attribute, attribute_value } from "@linthtml/dom-utils";
import { CharValue, Element, Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "label-req-for";

function buil_id_map(originnodement: Element) {
  let rnodem: Node = originnodement;
  while (rnodem.parent !== null) {
    rnodem = rnodem.parent as Node;
  }
  while (rnodem.prev !== null) {
    rnodem = rnodem.prev as Node;
  }

  const roots = [];
  while (rnodem !== null) {
    roots.push(rnodem);
    rnodem = rnodem.next as Node;
  }

  const idmap = new Map<string, Node>();

  function iteratenodements(nodement: Node) {
    if (is_tag_node(nodement) && has_attribute(nodement, "id")) {
      const id = (attribute_value(nodement, "id") as CharValue).chars;

      if (!idmap.has(id)) {
        idmap.set(id, nodement);
      }
    }

    if (nodement.children) {
      nodement.children.forEach(iteratenodements);
    }
  }
  roots.forEach(iteratenodements);

  return idmap;
}

function has_valid_child(nodement: Node) {
  // test for any nodement to be labeable
  return nodement.children.some(is_labelable);
}

// TODO: Cleanup rule code
function lint(node: Node, _config: unknown, { report }: { report: reportFunction }) {
  if (!is_tag_node(node) || node.name !== "label") {
    return;
  }
  if (has_attribute(node, "for") === false) {
    return report({
      // Report only "E020" ?
      code: has_valid_child(node) ? "E019" : "E020",
      position: node.open.loc
    });
  }

  // @ts-ignore
  if (!this.idmap) {
    // @ts-ignore
    this.idmap = buil_id_map(node);
  }

  const id = (attribute_value(node, "for") as CharValue).chars;
  // @ts-ignore
  const fornodement = this.idmap.get(id);

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
  // @ts-ignore
  this.idmap = null;
  return [];
}

export default {
  name: RULE_NAME,
  lint,
  end,

  // @ts-ignore
  idmap: null // needed?
} as RuleDefinition;
