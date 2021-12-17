const { config_from_path, find_local_config } = require("./read-config");
const Linter = require("./linter");
const LegacyLinter = require("./legacy/linter");
const presets = require("./presets").presets;

const path = require("path");
const fs = require("fs");
const globby = require("globby");
const ignore = require("ignore");
const { flatten } = require("./utils/arrays");

const DEFAULT_EXCLUDED_FOLDERS = [
  "!node_modules/"
];

/**
 * The linthtml namespace.
 * @namespace
 */
const linthtml = function(html, config) {
  if (config && config.rules !== undefined) {
    const linter = new Linter(config);
    return linter.lint(html);
  }
  const linter = new LegacyLinter(null, config);
  return linter.lint(html);
};

linthtml.fromConfig = function(config) {
  if (config && config.rules !== undefined) {
    return new Linter(config);
  }
  return new LegacyLinter(null, config);
};

// linthtml.use = function(plugins) {
//   plugins.forEach(function(plugin) {
//     if (typeof plugin === "string") {
//       plugin = require(plugin);
//     }

//     linthtml.use(plugin);
//   });
// };

function get_files_to_lint(input, config = {}) {
  const ignoreConfig = read_dot_ignore_file();
  let { ignoreFiles } = config;
  if (ignoreConfig) {
    ignoreFiles = ignoreConfig;
  }
  const file_paths = input.map(pattern => get_files_from_glob(pattern, ignoreFiles));
  return filter_ignored_files(flatten(file_paths), ignoreFiles);
}

function get_files_from_glob(glob_pattern, ignore_config) {
  const use_default_ignore = ignore_config === undefined && path.isAbsolute(glob_pattern) === false;

  return globby.sync([glob_pattern, ...DEFAULT_EXCLUDED_FOLDERS], {
    gitignore: use_default_ignore,
    expandDirectories: {
      files: ["**/*.html"],
      extensions: ["html"]
    }
  });
}

function filter_ignored_files(file_paths, ignore_pattern) {
  if (ignore_pattern === undefined) {
    return file_paths;
  }

  const ignorer = ignore().add(ignore_pattern);
  return ignorer.filter(file_paths);
}

function read_dot_ignore_file() {
  const ignore_file_path = path.join(process.cwd(), ".linthtmlignore");
  if (fs.existsSync(ignore_file_path)) {
    return fs.readFileSync(ignore_file_path).toString();
  }
}

function should_ignore_file(file_path, ignore_pattern) {
  if (ignore_pattern === undefined) {
    return false;
  }
  const ignorer = ignore().add(ignore_pattern);
  return ignorer.ignores(file_path);
}

function create_file_linter(file_path, config) {
  return {
    file_path,
    preset: config.preset,
    config_path: config.filepath,
    linter: linthtml.fromConfig(config.config)
  };
}

/**
 * Create a linter per each file found using the globs provided
 *
 * @param {string[]} globs - An array of globs
 * @param {string} [config_path] - Path the config file that will be use to create configure the linters
 */
linthtml.create_linters_for_files = function(globs, config_path) {
  if (config_path) {
    const config = config_from_path(config_path);
    const files = get_files_to_lint(globs, config.config);
    return files.map(file_path => create_file_linter(file_path, config));
  }
  const files = get_files_to_lint(globs);
  return files.reduce((files_to_lint, file_path) => {
    let config = find_local_config(file_path);

    if (!config) {
      config = {
        config: presets.default,
        preset: "default"
      };
    }
    // if no config fallback to presets as before
    if (!should_ignore_file(file_path, config.config.ignoreFiles)) {
      return files_to_lint.concat(create_file_linter(file_path, config));
    }
    return files_to_lint;
  }, []);
};

linthtml.from_config_path = function(config_path) {
  const config = config_from_path(config_path);
  return linthtml.fromConfig(config.config);
};

linthtml.Linter = Linter;
linthtml.LegacyLinter = LegacyLinter;
linthtml.rules = require("./rules");
linthtml.messages = require("./messages");

module.exports = linthtml;
