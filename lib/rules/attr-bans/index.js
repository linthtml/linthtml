const Issue = require("../../issue");
const { isRegExp } = require("util");


module.exports = {
  name: "attr-bans",
  on: ["tag"],
  need: "tag",

  validateConfig(config) {
    let typeError = (type) => `Configuration for rule "${this.name}" is invalid: Expected string, RegExp or (string|RegExp)[] got ${type}`;
    if (Array.isArray(config)) {
      config.forEach(attr => {
        let type = typeof attr;
        if (type !== "string" && isRegExp(attr) === false) {
          throw new Error(typeError(`${type}[]`));
        }
      });
      return config;
    }
    if(typeof config === "string" || isRegExp(config)) {
      return config;
    }
    throw new Error(typeError(typeof config));
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
    } else if (attrs[name]) {
      addIssue(name);
    }
  });

  return issues;
};
