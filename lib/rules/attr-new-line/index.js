const { is_tag_node } = require("../../knife/tag_utils");

const RULE_NAME = "attr-new-line";

function validateConfig(option) {
  if (typeof option === "number" || option === "+0") {
    return option;
  }
  throw new Error(`Configuration for rule "${this.name}" is invalid: Expected number or "+0" got ${typeof option}`);
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} opts
 * @param {*} param2
 */
function lint(node, opts, { report }) {
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

  const attributes_lines = node.attributes.reduce((m, attribute) => {
    const line = m.get(attribute.loc.start.line) || [];
    m.set(attribute.loc.start.line, line.concat([attribute]));
    if (attribute.loc.end.line !== attribute.loc.start.line) {
      const line = m.get(attribute.loc.end.line) || [];
      m.set(attribute.loc.end.line, line.concat([attribute]));
    }
    return m;
  }, new Map());

  const allow_attributes_on_first_line = option === "+0" || option > 0;
  const row_limit = (option === 0 || option === "+0")
    ? 1
    : Math.floor(option);

  const tag_line = node.open.loc.start.line;

  const it = attributes_lines.entries();
  let tmp = it.next();
  while (!tmp.done) {
    const [line, attributes] = tmp.value;
    if (line === tag_line) {
      const nb_attributes_allowed = allow_attributes_on_first_line
        ? row_limit
        : 0;
      attributes.slice(nb_attributes_allowed).map(reportIssue);
    } else {
      attributes.slice(row_limit).map(reportIssue);
    }
    tmp = it.next();
  }
}

module.exports = {
  name: RULE_NAME,
  validateConfig,
  lint
};
