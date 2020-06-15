/* eslint-disable-next-line */
const { isRegExp } = require("util");
const { isTagNode } = require("../../knife/tag_utils");

module.exports = {
  name: "attr-order",
  on: ["dom"],
  need: "dom",

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

module.exports.lint = function(node, opts, { report }) {
  if (isTagNode(node) === false) {
    return;
  }
  const order = mutConfig(opts[this.name]);
  let lastpos = 0;
  let lastname;
  const matched = {};

  // Improve algo
  const attrs = {};
  node.attributes.forEach(attribute => {
    const name = attribute.name.chars.toLowerCase();
    if (attrs[name] === undefined) {
      attrs[name] = attribute;
    }
  });

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
        const pos = a.index;
        n += " (" + name + ")"; // For error output
        if (pos > lastpos) {
          lastpos = pos;
          lastname = n;
          // Check only fails if keys are not ordered by insertion
          /* istanbul ignore else */
        } else if (pos < prevpos) {
          report({
            code: "E043",
            position: a.loc,
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
      const pos = a.index;
      if (pos > lastpos) {
        lastpos = pos;
        lastname = name;
      } else {
        report({
          code: "E043",
          position: a.loc,
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

// TODO: Clean/improve algo
// const html = "<img height='200' src='test.gif' class='test' width='300'/>";
// // should report error for src and class but not height and width
// const issues = await linter.lint(html, none, { "attr-order": ["class", "src", "height", "width"] });
