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

module.exports.lint = function(title, opts, { report }) {
  const maxlen = opts[this.name];

  const text = title.children
    .filter(function(c) {
      return c.type === "text";
    })
    .map(function(c) {
      return c.data;
    })
    .join("");
  if (text.length > maxlen) {
    report({
      code: "E029",
      position: title.openLineCol,
      meta: {
        data: {
          title: text,
          maxlength: maxlen
        }
      }
    });
  }
};
