module.exports = {
  name: "doctype-first",
  on: ["dom"],
  need: "dom",
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

module.exports.lint = function(element, opts, { report }) {
  const option = opts[this.name];

  if (this.passedFirst || element.type === "comment" || isWhitespace(element)) {
    return;
  }
  this.passedFirst = true;

  if (
    element.type === "directive" &&
    element.name.toUpperCase() === "!DOCTYPE"
  ) {
    return;
  }

  // If the option is 'smart', fail only if a head tag is present.
  if (
    option === "smart" &&
    !(element.type === "tag" && element.name.toLowerCase() === "head")
  ) {
    return;
  }

  report({
    code: "E007",
    position: element.openLineCol || element.lineCol
  });
};

function isWhitespace(element) {
  return element.type === "text" && /^[ \t\n\f\r]*$/.test(element.data);
}
