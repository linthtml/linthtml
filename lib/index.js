const { config_from_path, find_local_config } = require("./cli/read-config");
const Linter = require("./linter");
const LegacyLinter = require("./legacy/linter");
const presets = require("./presets").presets;

/**
 * The linthtml namespace.
 * @namespace
 */
const linthtml = function(html, config) {
  if (config && config.rules !== undefined) {
    const linter = new Linter(config);
    return linter.lint(html);
  }
  const linter = new LegacyLinter(...arguments);
  return linter.lint.apply(linter, arguments);
};

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

linthtml.create_linter_for_file = function(file_path, config_path) {
  let config = find_config_for_file(file_path, config_path);

  if (config === null) {
    config = presets.default;
  }

  config = config.config ? config.config : config;

  return linthtml.fromConfig(config);
};

function find_config_for_file(file_path, config_path = null) {
  if (config_path) {
    return config_from_path(config_path);
  }
  return find_local_config(file_path);
}

module.exports = linthtml;
