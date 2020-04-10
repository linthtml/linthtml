const { hasNonEmptyAttr } = require("../../knife");
const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "input-btn-req-value-or-title",
  on: ["dom"],
  need: "dom"
};

module.exports.lint = function(element, opts, { report }) {
  if (isTagNode(element) === false || element.name !== "input") {
    return;
  }
  const { type, value, title } = element.attribs;
  if (!type || ["button", "submit", "reset"].indexOf(type.value) === -1) {
    return [];
  }

  if (!(value || title || hasNonEmptyAttr(element, "aria-label"))) {
    report({
      code: "E060",
      position: element.openLineCol
    });
  }
};

// Valid for axe-core
/*
<input type="button" value="button"/>

<input type="button" title="button" />

<input type="button" aria-labelledby="foo">
<span id="foo">Button</span>

<input type="button" aria-label="button" />

*/
