const Issue = require("../../issue");

module.exports = {
  name: "title-max-len",
  on: ["title"],
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

module.exports.lint = function(titles, opts) {
  var maxlen = opts[this.name],
    output = [];

  titles.map(function(t) {
    var text = t.children
      .filter(function(c) {
        return c.type === "text";
      })
      .map(function(c) {
        return c.data;
      })
      .join("");
    if (text.length > maxlen) {
      output.push(
        new Issue("E029", t.openLineCol, { title: text, maxlength: maxlen })
      );
    }
  });
  return output;
};
