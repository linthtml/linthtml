const { is_tag_node } = require("../../knife/tag_utils");

module.exports = {
  name: "attr-new-line",
  on: "dom",
  validateConfig(option) {
    if (typeof option === "number" || option === "+0") {
      return option;
    }
    throw new Error(`Configuration for rule "${this.name}" is invalid: Expected number or "+0" got ${typeof option}`);
  }
};

module.exports.lint = function(node, opts, { report }) {
  const option = opts[this.name];
  const reportIssue = (attribute) =>
    report({
      code: "E037",
      position: attribute.loc,
      meta: {
        data: {
          limit: option
        }
      }
    });

  if (is_tag_node(node) === false) {
    return;
  }

  const attributes_lines = new Map();

  node.attributes.forEach((attribute) => {
    const line = attributes_lines.get(attribute.loc.start.line) || [];
    attributes_lines.set(attribute.loc.start.line, line.concat([attribute]));
    if (attribute.loc.end.line !== attribute.loc.start.line) {
      const line = attributes_lines.get(attribute.loc.end.line) || [];
      attributes_lines.set(attribute.loc.end.line, line.concat([attribute]));
    }
  });

  const zero_plus = option === "+0";
  const rowLimit = zero_plus ? 0 : Math.floor(option);
  // let tag_line = node.loc.start.line;
  const tag_line = node.open.loc.start.line;
  const it = attributes_lines.entries();
  let tmp = it.next();
  while (!tmp.done) {
    const [line, attributes] = tmp.value;
    if (zero_plus && line === tag_line) {
      attributes.slice(1).map(reportIssue);
    } else {
      if (attributes.length > rowLimit) {
        attributes.slice(rowLimit).map(reportIssue);
      }
    }
    tmp = it.next();
  }
};
