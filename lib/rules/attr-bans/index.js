const Issue = require("../../issue");
const { isRegExp } = require("util");


module.exports = {
  name: "attr-bans",
  on: ["tag"],
  desc: [
    "The value of this option is a list of strings, each of which is an",
    "attribute name.",
    "Attributes with any of the given names are disallowed."
  ].join("\n"),
  process(opts) {
    let typeError = (type) => `Configuration for rule "${this.name}" is invalid: Expected string, RegExp or (string|RegExp)[] got ${type}`;
    if (Array.isArray(opts)) {
      opts = opts.map(opt => {
        let type = typeof opt;
        if (type === "string") {
          return opt.toLowerCase();
        }
        if (isRegExp(opt)) {
          return opt;
        }
        throw new Error(typeError(`${type}[]`));
      });
      return opts;
    }
    if(typeof opts === "string" || isRegExp(opts)) {
      return [opts];
    }
    throw new Error(typeError(typeof opts));
  }
};

module.exports.lint = function(element, opts) {
  var bannedAttrs = opts[this.name];

  var attrs = element.attribs;
  var issues = [];
  function addIssue(name) {
    issues.push(
      new Issue("E001", attrs[name].nameLineCol, { attribute: name })
    );
  }

  bannedAttrs.forEach(function(name) {
    if (isRegExp(name)) {
      Object.keys(attrs)
        .filter(function(n) {
          return name.test(n) === true;
        })
        .forEach(addIssue);
    } else if (attrs.hasOwnProperty(name)) {
      addIssue(name);
    }
  });

  return issues;
};
