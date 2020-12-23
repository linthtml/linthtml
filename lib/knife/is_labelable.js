const { attribute_has_value } = require("./tag_utils");

// these elements are *labelable elements* according to the HTML spec
const LABELABLE_NODES = [
  "button",
  "input", // if not in the hidden state
  "keygen",
  "meter",
  "output",
  "progress",
  "select",
  "textarea"
];

/**
 * Returns whether or not an html element can be associated with a
 * label element.
 * @param {Object} node - an html node from the htmlparser2 parser
 * @returns {Boolean} whether or not the node is labelable
 */
module.exports = function(node) {
  if (node.type !== "tag" || !LABELABLE_NODES.includes(node.name)) {
    // element isn't a tag or isn't a labeable element
    return false;
  }

  if (node.name === "input" && attribute_has_value(node, "type", "hidden")) {
    // inputs that are hidden are not labeable elements
    return false;
  }

  // element passed all the tests
  return true;
};
