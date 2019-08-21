const knife = require("../../knife");
const Issue = require("../../issue");

module.exports = {
  name: "tag-close",
  on: ["tag"],
  options: [
    {
    },
    {
      name: "tag-name-match"
    },
    {
      name: "tag-self-close",
      validateConfig(option) {
        if (typeof option !== "string") {
          throw new Error(`Configuration for rule "${this.name}" is invalid: Expected string got ${typeof option}`);
        }
        if (["always", "never"].indexOf(option) === -1) {
          throw new Error(`Configuration for rule "${this.name}" is invalid: "${option}" is not accepted. Accepted values are "always" and "never".`);
        }
        return option;
      }
    }
  ]
};

module.exports.lint = function(element, opts) {
  // If the tag did not close itself
  if (
    !element.close ||
    element.name.toLowerCase() !== element.close.toLowerCase() // remove toLowerCase
  ) {
    if (knife.isVoidElement(element.name)) {
      var selfClose = knife.isSelfClosing(element);
      var style = opts["tag-self-close"];
      if (
        (style === "always" && !selfClose) ||
        (style === "never" && selfClose)
      ) {
        return new Issue("E018", element.openLineCol, { expect: style });
      }
    } else {
      if (opts["tag-close"]) {
        return new Issue("E042", element.openLineCol);
      }
    }
  } else {
    if (opts["tag-name-match"] && element.name !== element.close) {
      return new Issue("E030", element.closeLineCol);
    }
  }

  return [];
};
