const Issue = require("../../issue");

module.exports = {
  name: "tag-bans",
  on: ["dom"],
  filter: ["tag", "style", "script"],
  validateConfig(options) {
    let typeError = (type) => `Configuration for rule "${this.name}" is invalid: Expected string or string[] got ${type}`;
    if (Array.isArray(options)) {
      return options.map(option => {
        let type = typeof option;
        if (type !== "string") {
          throw new Error(typeError(`${type}[]`));
        }
      });
    }
    if(typeof options !== "string") {
      throw new Error(typeError(typeof options));
    }
  }
};

function mutConfig(options) {
  if (Array.isArray(options)) {
    return options.map(option => {
      let type = typeof option;
      if (type === "string") {
        return option.toLowerCase();
      }
      return option;
    });
  }
  if(typeof options === "string") {
    options = [options];
  }
  return options;
}

module.exports.lint = function(element, opts) {
  let format = opts[this.name];
  format = mutConfig(format);
  return format.indexOf(element.name) < 0
    ? []
    : new Issue("E016", element.openLineCol, { tag: element.name });
};
