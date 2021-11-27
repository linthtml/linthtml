const { types: { isRegExp } } = require("util");
const { is_tag_node, get_attribute } = require("../../knife/tag_utils");

const RULE_NAME = "attr-order";
function validateConfig(options) {
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

function mut_config(options) {
  if (Array.isArray(options)) {
    return options.map(option => {
      if (typeof option === "string") {
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

/**
 * @param {import('../../parser/index').Node} node
 * @param {*} config
 * @param {*} param2
 */
function lint(node, config, { report }) {
  if (is_tag_node(node) === false) {
    return;
  }
  const order = mut_config(config);
  let lastpos = 0;
  let lastname;
  const matched = {};

  // Improve algo
  const attributes = {};
  node.attributes.forEach(attribute => {
    const name = attribute.name.chars.toLowerCase();
    if (attributes[name] === undefined) {
      attributes[name] = attribute;
    }
  });

  order.forEach(function(name) {
    if (isRegExp(name)) {
      const prevpos = lastpos;
      const prevname = lastname;
      Object.keys(attributes).forEach(function(attribute_name) {
        if (matched[attribute_name] || !name.test(attribute_name)) {
          return;
        }
        const pos = attributes[attribute_name].index;
        matched[attribute_name] = true;
        if (pos > lastpos) {
          lastpos = pos;
          lastname = attribute_name;
          // Check only fails if keys are not ordered by insertion
          /* istanbul ignore else */
        } else if (pos < prevpos) {
          const attribute = get_attribute(node, prevname);
          report({
            code: "E043",
            position: attribute.loc,
            meta: {
              data: {
                attribute: prevname,
                previous: attribute_name
              }
            }
          });
        }
      });
    } else {
      if (attributes[name] === undefined || attributes[name] === null) {
        return;
      }
      const pos = attributes[name].index;
      matched[name] = true;
      if (pos > lastpos) {
        lastpos = pos;
        lastname = name;
      } else {
        const attribute = get_attribute(node, lastname);
        report({
          code: "E043",
          position: attribute.loc,
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
}

// TODO: Clean/improve algo
// const html = "<img height='200' src='test.gif' class='test' width='300'/>";
// // should report error for src and class but not height and width
// const issues = await linter.lint(html, { "attr-order": ["class", "src", "height", "width"] });

module.exports = {
  name: RULE_NAME,
  validateConfig,
  lint
};
