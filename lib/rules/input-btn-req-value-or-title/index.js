const { hasNonEmptyAttr } = require("../../knife");

module.exports = {
  name: "input-btn-req-value-or-title",
  on: ["tag"],
  need: "tag",
  filter: ["input"]
};

module.exports.lint = function(element, opts, { report }) {
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
