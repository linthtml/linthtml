const Linter = require("./linter");
const LegacyLinter = require("./legacy/linter");

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
var linthtml = function(html, config) {

  if (config && config.hasOwnProperty('rules')) {
    const linter = new Linter(config);
    return linter.linth(html);
  }
  const linter = new LegacyLinter();
  return linter.lint.apply(linter, arguments);
};

module.exports = linthtml;

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
