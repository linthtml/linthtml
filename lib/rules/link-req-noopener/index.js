module.exports = {
  name: "link-req-noopener",
  on: ["tag"],
  need: "tag",
  filter: ["a"]
};

module.exports.lint = function(element, opts, { report }) {
  function getVal(a/*, value */) {
    return a && a.value;
  }

  const noopen = /(^| )(noopener|noreferrer)( |$)/;

  const attrs = element.attribs;
  if (getVal(attrs.target) === "_blank" && !noopen.test(getVal(attrs.rel))) {
    report({
      code: "E058",
      position: element.openLineCol
    });
  }
};

// <base target="_blank" />
// https://html.com/attributes/base-target/
