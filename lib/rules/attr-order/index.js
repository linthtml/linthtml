/* eslint-disable-next-line */
const { isRegExp } = require("util");

module.exports = {
  name: "attr-order",
  on: ["tag"],
  need: "tag",

  validateConfig(options) {
    const typeError = (type) => `Configuration for rule "${this.name}" is invalid: Expected (string|RegExp)[] got ${type}`;
    if (Array.isArray(options)) {
      options = options.map(option => {
        const type = typeof option;
        if (type === "string") {
          return option.toLowerCase();
        }
        if (isRegExp(option)) {
          return option;
        }
        throw new Error(typeError(`${type}[]`));
      });
      return options;
    }
    throw new Error(typeError(typeof options));
  }
};

function mutConfig(options) {
  if (Array.isArray(options)) {
    return options.map(option => {
      const type = typeof opt;
      if (type === "string") {
        return option.toLowerCase();
      }
      if (isRegExp(option)) {
        return option;
      }
      return option;
    });
  }
  return options;
}

module.exports.lint = function(element, opts, { report }) {
  let order = opts[this.name];
  const attrs = element.attribs;
  let lastpos = 0;
  let lastname;
  const matched = {};
  order = mutConfig(order);
  order.forEach(function(name) {
    if (isRegExp(name)) {
      const prevpos = lastpos;
      const prevname = lastname;
      Object.keys(attrs).forEach(function(n) {
        if (matched[n] || !name.test(n)) {
          return;
        }
        const a = attrs[n];
        matched[n] = true;
        const pos = a.nameIndex;
        n += " (" + name + ")"; // For error output
        if (pos > lastpos) {
          lastpos = pos;
          lastname = n;
          // Check only fails if keys are not ordered by insertion
          /* istanbul ignore else */
        } else if (pos < prevpos) {
          report({
            code: "E043",
            position: a.nameLineCol,
            meta: {
              data: {
                attribute: prevname,
                previous: n
              }
            }
          });
        }
      });
    } else {
      if (attrs[name] === undefined || attrs[name] === null) {
        return;
      }
      const a = attrs[name];
      matched[name] = true;
      const pos = a.nameIndex;
      if (pos > lastpos) {
        lastpos = pos;
        lastname = name;
      } else {
        report({
          code: "E043",
          position: a.nameLineCol,
          meta: {
            data: {
              attribute: lastname,
              previous: name
            }
          }
        });
      }
    }
  });
};
