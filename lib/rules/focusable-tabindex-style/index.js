const Issue = require("../../issue");

module.exports = {
  name: "focusable-tabindex-style",
  on: ["tag"],
  filter: ["a", "area", "button", "input", "img", "select", "textarea"],
  desc: [
    "If set, all focusable elements",
    "(`a`, `area`, `button`, `input`, `img`, `select`, `textarea`)",
    "must have a positive `tabindex` attribute, if any.",
    "",
    "Reasoning: [IITAA, 10.3 and 10.4](http://www.dhs.state.il.us/IITAA/IITAAWebImplementationGuidelines.html)"
  ].join("\n"),

  detectedStyle: null
};

module.exports.end = function() {
  this.detectedStyle = null;
};

module.exports.lint = function(element/*, opts*/) {
  if (this.isDisabled(element)) {
    return [];
  }

  var tabindex = getTabindex(element);

  if (tabindex < 0) {
    return new Issue("E026", element.openLineCol);
  }
  return [];
};

module.exports.isDisabled = function(element) {
  return element.attribs && element.attribs.hasOwnProperty("disabled");
};

function getTabindex(element) {
  const attributes = element.attribs;

  if (attributes && attributes.hasOwnProperty("tabindex") && typeof attributes !== "undefined") {
    return attributes.tabindex.value;
  }

  return 0;
}
