const Issue = require("../../issue");

module.exports = {
  name: "tag-bans",
  on: ["dom"],
  filter: ["tag", "style", "script"],
  desc: [
    "The value of this option is a list of strings, each of which is a tag",
    "name. Tags with any of the given names are disallowed."
  ].join("\n"),
  process(opts) {
    let typeError = (type) => `Configuration for rule "${this.name}" is invalid: Expected string or string[] got ${type}`;
    if (Array.isArray(opts)) {
      opts = opts.map(opt => {
        let type = typeof opt;
        if (type === "string") {
          return opt.toLowerCase();
        }
        throw new Error(typeError(`${type}[]`));
      });
      return opts;
    }
    if(typeof opts === "string") {
      return [opts];
    }
    throw new Error(typeError(typeof opts));
  }
};

module.exports.lint = function(element, opts) {
  var format = opts[this.name];
  return format.indexOf(element.name) < 0
    ? []
    : new Issue("E016", element.openLineCol, { tag: element.name });
};
