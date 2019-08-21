var knife = require("../../knife"),
  Issue = require("../../issue");

module.exports = {
  name: "id-class-no-ad",
  on: ["tag"]
};
module.exports.lint = function(node/*, opts*/) {
  let issues = [];
  let attributes = Object.values(node.attribs);
  // TODO: Remove after `raw-ignore-text` refacto
  attributes = attributes.filter(attribute => /^¤+$/.test(attribute.rawName) === false);
  attributes = attributes.filter(attribute => attribute.rawName === "id" || attribute.rawName === "class");

  attributes.forEach(attribute => {

    const regex = /(^|[^a-zA-Z0-9])(ad|banner|social)(?![a-zA-Z0-9])/;
    const match = regex.exec(attribute.value);
    if (match) {
      const index = match.index + match[1].length,
      lc = knife.getLineColFunc(attribute.value, attribute.valueLineCol)(index);
      issues.push(new Issue("E010", lc, { word: match[2] }));
    }
  });
  return issues;
};
