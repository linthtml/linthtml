const Issue = require("../../issue");

module.exports = {
  name: "title-max-len",
  on: ["tag"],
  need: "tag",
  filter: ["title"],
  validateConfig(option) {
    if (typeof option !== "number") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected number got ${typeof option}`);
    }
    if (option < 0) {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Only positive indent value are allowed.`);
    }
    return option;
  }
};

module.exports.lint = function(title, opts) {
  var maxlen = opts[this.name],
    output = [];

  var text = title.children
    .filter(function(c) {
      return c.type === "text";
    })
    .map(function(c) {
      return c.data;
    })
    .join("");
  if (text.length > maxlen) {
    output.push(
      new Issue("E029", title.openLineCol, { title: text, maxlength: maxlen })
    );
  }
  return output;
};
