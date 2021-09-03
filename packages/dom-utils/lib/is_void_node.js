const VOID_NODES = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "menuitem",
  "meta",
  "param",
  "source",
  "track",
  "wbr",

  // common self closing svg elements
  "path",
  "circle",
  "ellipse",
  "line",
  "rect",
  "use",
  "stop",
  "polyline",
  "polygon"
];

/**
 * Returns whether or not an html tag name is a void element.
 * @param {Object} node
 * @returns {Boolean} whether or not `tagName` is a void element
 */
module.exports = function({ name }) {
  return VOID_NODES.indexOf(name.toLowerCase()) !== -1;
};
