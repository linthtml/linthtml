const RULE_NAME = "doctype-first";

function validateConfig(option) {
  if (typeof option === "string" && option !== "smart") {
    throw new Error(`Configuration for rule "${this.name}" is invalid: Only "smart" is accepted as string value`);
  }

  if (typeof option !== "boolean" && typeof option !== "string") {
    throw new Error(`Configuration for rule "${this.name}" is invalid: Expected boolean got ${typeof option}`);
  }

  return option;
}

function end() {
  this.passedFirst = false;
}

function isWhitespace(element) {
  return element.type === "text" && /^[ \t\n\f\r]*$/.test(element.data);
}

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, mode, { report }) {
  // CHECK if parent if first child instead
  // USE util function to check node type
  if (this.passedFirst || node.type === "comment" || isWhitespace(node)) {
    return;
  }
  this.passedFirst = true;

  if (
    node.type === "directive" &&
    node.name.toUpperCase() === "!DOCTYPE"
  ) {
    return;
  }

  // If the option is 'smart', fail only if a head tag is present.
  if (
    mode === "smart" &&
    !(node.type === "tag" && node.name.toLowerCase() === "head")
  ) {
    return;
  }

  report({
    code: "E007",
    position: node.open ? node.open.loc : node.loc
  });
}

module.exports = {
  name: RULE_NAME,
  validateConfig,
  lint,
  end,

  passedFirst: false
};
