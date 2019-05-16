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
  validateConfig(options) {
    let typeError = (type) => `Configuration for rule "${this.name}" is invalid: Expected string, RegExp or (string|RegExp)[] got ${type}`;
    if (Array.isArray(options)) {
      options = options.map(option => {
        let type = typeof option;
        if (type !== "string" && isRegExp(option) === false) {
          throw new Error(typeError(`${type}[]`));
        }
      });
      return options;
    }
    if(typeof options === "string" || isRegExp(options)) {
      return options;
    }
    throw new Error(typeError(typeof options));
  }
};

function mutConfig(options) {
  if (Array.isArray(options)) {
    return options.map(option => {
      let type = typeof option;
      if (type === "string") {
        return option.toLowerCase();
      }
      if (isRegExp(option)) {
        return option;
      }
      return option;
    });
  }
  if(typeof options === "string" || isRegExp(options)) {
    options = [options];
  }
  return options;
}

module.exports.lint = function(element, opts) {
  let bannedAttrs = opts[this.name];

  bannedAttrs = mutConfig(bannedAttrs);

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
