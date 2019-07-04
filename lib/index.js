const Linter = require("./linter");

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
var linthtml = function() {
  var linter = linthtml.defaultLinter;

  return linter.lint.apply(linter, arguments);
};

module.exports = linthtml;

linthtml.Linter = Linter;
linthtml.rules = require("./rules");
linthtml.messages = require("./messages");
linthtml.defaultLinter = new Linter(linthtml.rules);

linthtml.use = function(plugins) {
  plugins.forEach(function(plugin) {
    if (typeof plugin === "string") {
      plugin = require(plugin);
    }

    linthtml.defaultLinter.use(plugin);
  });
};
