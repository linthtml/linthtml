module.exports = {
  name: "doctype-first",
  on: "dom",
  validateConfig(option) {
    if (typeof option === "string" && option !== "smart") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Only "smart" is accepted as string value`);
    }

    if (typeof option !== "boolean" && typeof option !== "string") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected boolean got ${typeof option}`);
    }

    return option;
  },

  passedFirst: false
};

module.exports.end = function() {
  this.passedFirst = false;
};

module.exports.lint = function(node, opts, { report }) {
  const option = opts[this.name];

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
    option === "smart" &&
    !(node.type === "tag" && node.name.toLowerCase() === "head")
  ) {
    return;
  }

  report({
    code: "E007",
    position: node.open ? node.open.loc : node.loc
  });
};

function isWhitespace(element) {
  return element.type === "text" && /^[ \t\n\f\r]*$/.test(element.data);
}
