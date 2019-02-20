var lodash = require("lodash"),
  Linter = require("./linter");

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
 * The lintHTML namespace.
 * @namespace
 */
var lintHTML = function() {
  var linter = lintHTML.defaultLinter;

  return linter.lint.apply(linter, arguments);
};

module.exports = lintHTML;

lintHTML.Linter = Linter;
lintHTML.rules = require("./rules");
lintHTML.messages = require("./messages");
lintHTML.defaultLinter = new Linter(lintHTML.rules);

lintHTML.use = function(plugins) {
  plugins.forEach(function(plugin) {
    if (lodash.isString(plugin)) {
      plugin = require(plugin);
    }

    lintHTML.defaultLinter.use(plugin);
  });
};
