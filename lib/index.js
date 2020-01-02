const Linter = require("./linter");
const LegacyLinter = require("./legacy/linter");

// Object.values is partially supported in nodejs 6
/* istanbul ignore next */
Object.values =
  Object.values ||
  function(obj) {
    return Object.keys(obj).reduce(function(values, key) {
      values.push(obj[key]);
      return values;
    }, []);
  };

/**
 * The linthtml namespace.
 * @namespace
 */
const linthtml = function(html, config) {
  if (config && config.rules !== undefined) {
    const linter = new Linter(config);
    return linter.lint(html);
  }
  const linter = new LegacyLinter();
  return linter.lint.apply(linter, arguments);
};

module.exports = linthtml;

linthtml.fromConfig = function(config) {
  if (config && config.rules !== undefined) {
    return new Linter(config);
  }
  const linter = new LegacyLinter();
  /* eslint-disable-next-line */
  linter.lint.call(linter, "", config);
  return linter;
};

linthtml.Linter = Linter;
linthtml.LegacyLinter = LegacyLinter;
linthtml.rules = require("./rules");
linthtml.messages = require("./messages");

// linthtml.use = function(plugins) {
//   plugins.forEach(function(plugin) {
//     if (typeof plugin === "string") {
//       plugin = require(plugin);
//     }

//     linthtml.use(plugin);
//   });
// };
