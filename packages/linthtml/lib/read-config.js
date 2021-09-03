const { cosmiconfigSync } = require("cosmiconfig");
const path = require("path");
const fs = require("fs");
const CustomError = require("./utils/custom-errors");

const globalModules = require("global-modules");
const resolveFrom = require("resolve-from");

const IS_TEST = process.env.NODE_ENV === "test";
const STOP_DIR = IS_TEST ? path.resolve(__dirname, "..") : undefined;

/**
 * @param {string} basedir
 * @param {string} module_name
 * @return {string}
 */
function get_module_path(basedir, module_name) {
  // 1. Try to resolve from the provided directory
  // 2. Try to resolve from `process.cwd`
  // 3. Try to resolve from global `node_modules` directory
  let path = resolveFrom.silent(basedir, module_name);

  if (!path) {
    path = resolveFrom.silent(process.cwd(), module_name);
  }

  if (!path) {
    path = resolveFrom.silent(globalModules, module_name);
  }

  if (!path) {
    throw new CustomError("CORE-03", { module_name });
  }

  return path;
}

function merge_configs(a, b) {
  let plugins = [];

  if (a.plugins || b.plugins) {
    if (a.plugins) {
      plugins = [...a.plugins];
    }

    if (b.plugins) {
      plugins = [...new Set([...plugins, ...b.plugins])];
    }
  }
  return {
    ...a,
    ...b,
    plugins,
    plugins_rules: {
      ...a.plugins_rules,
      ...b.plugins_rules
    },
    rules: {
      ...a.rules,
      ...b.rules
    }
  };
}

/**
 * @param {CosmiconfigResult} cosmiconfig_result
 * @return {CosmiconfigResult}
 */
function augment_config(cosmiconfig_result) {
  if (!cosmiconfig_result) {
    return null;
  }

  const config_dir = path.dirname(cosmiconfig_result.filepath || "");
  const { ignoreFiles = [], ...config } = cosmiconfig_result.config;
  let result = {
    filepath: cosmiconfig_result.filepath,
    config
  };

  if (config.extends) {
    const normalized_extends = Array.isArray(config.extends) // throw an error if not string or array
      ? config.extends
      : [config.extends];

    const extended_config = normalized_extends.reduce((extended_config, extends_path) => {
      const configResult = load_extended_config(extends_path, config_dir);
      return merge_configs(extended_config, configResult);
    }, {});

    result = {
      filepath: result.filepath,
      config: merge_configs(
        extended_config,
        result.config
      )
    };
  }
  return {
    filepath: result.filepath,
    config: {
      ...result.config,
      ignoreFiles
    }
  };
}

/**
 * @param {object} extends_path
 * @param {string} config_dir
 * @return {CosmiconfigResult}
 */
function load_extended_config(extends_path, config_dir) {
  const extendPath = get_module_path(config_dir, extends_path);
  // create cosmiconfigSync only once ?
  const cosmiconfig_result = cosmiconfigSync(null, {
    stopDir: STOP_DIR,
    transform: augment_config
  }).load(extendPath);
  return cosmiconfig_result
    ? cosmiconfig_result.config
    : null;
}

/**
 * @param {Object} rule_definition
 * @param {string} plugin_name
 * @throws {CustomError}
 */
function check_plugin_rule(rule_definition, plugin_name) {
  if (!rule_definition.name) {
    throw new CustomError("CORE-06", { plugin_name });
  }

  if (!rule_definition.name.includes("/")) {
    throw new CustomError("CORE-07", { rule_name: rule_definition.name, plugin_name });
  }

  if (!rule_definition.lint) {
    throw new CustomError("CORE-08", { rule_name: rule_definition.name });
  }
}

/**
 * @param {string} plugin_name
 * @returns {Object}
 * @throws {CustomError}
 */
function load_plugin(plugin_name) {
  try {
    const plugin_import = require(plugin_name);
    // Handle either ES6 or CommonJS modules
    return plugin_import.default || plugin_import;
  } catch (error) {
    throw new CustomError("CORE-05", { module_name: plugin_name });
  }
}

/**
 * @param {CosmiconfigResult} cosmiconfig_result
 * @returns {CosmiconfigResult}
 * @throws {CustomError}
 */
function add_plugins_rules(cosmiconfig_result) {
  if (cosmiconfig_result.config.plugins) {
    const normalized_plugins = Array.isArray(cosmiconfig_result.config.plugins) // throw an error if not string or array
      ? cosmiconfig_result.config.plugins
      : [cosmiconfig_result.config.plugins];

    const plugins_rules = normalized_plugins.reduce((plugin_rules, plugin_name) => {
      const { rules } = load_plugin(plugin_name);

      if (rules && !Array.isArray(rules)) {
        throw new CustomError("CORE-09", { plugin_name });
      }

      rules.forEach((rule_definition) => {
        check_plugin_rule(rule_definition, plugin_name);
        plugin_rules[rule_definition.name] = rule_definition;
      });

      return plugin_rules;
    }, []);

    return {
      ...cosmiconfig_result,
      config: merge_configs(
        cosmiconfig_result.config,
        { plugins_rules }
      )
    };
  }

  return cosmiconfig_result;
}

const explorer = cosmiconfigSync("linthtml", {
  stopDir: STOP_DIR,
  packageProp: "linthtmlConfig",
  transform: augment_config
});

function config_from_path(file_path) {
  const config_path = path.resolve(process.cwd(), file_path);
  let isconfig_directory = false;
  try {
    let config = null;
    isconfig_directory = fs.lstatSync(config_path).isDirectory();
    if (isconfig_directory) {
      // stopDir: config_path needed?
      // create cosmiconfigSync only once ?
      config = cosmiconfigSync("linthtml", {
        stopDir: config_path,
        packageProp: "linthtmlConfig",
        transform: augment_config
      }).search(config_path);
    } else {
      config = explorer.load(config_path);
    }
    if (config === null) {
      throw new Error();
    }
    return add_plugins_rules(config);
  } catch (error) {
    // let CustomError (like CORE-03) passthrough
    if (error instanceof CustomError) {
      throw error;
    }
    if (isconfig_directory) {
      throw new CustomError("CORE-01", { config_path });
    }
    throw new CustomError("CORE-02", { config_path });
  }
}

function find_local_config(file_path) {
  const config = explorer.search(file_path);
  return config
    ? add_plugins_rules(config)
    : null;
}

module.exports = {
  config_from_path,
  find_local_config,
  get_module_path
};
