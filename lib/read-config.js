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
  return {
    ...a,
    ...b,
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
  const { ignoreFiles, ...config } = cosmiconfig_result.config;

  if (config.extends) {
    const normalized_extends = Array.isArray(config.extends) // throw an error if not string or array
      ? config.extends
      : [config.extends];

    const extended_config = normalized_extends.reduce((extended_config, extends_path) => {
      const configResult = load_extended_config(extends_path, config_dir);
      return merge_configs(extended_config, configResult);
    }, {});

    return {
      filepath: cosmiconfig_result.filepath,
      config: merge_configs(
        extended_config,
        config
      )
    };
  }
  return cosmiconfig_result;
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
    return config;
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

const explorer = cosmiconfigSync("linthtml", {
  stopDir: STOP_DIR,
  packageProp: "linthtmlConfig",
  transform: augment_config
});

function find_local_config(file_path) {
  return explorer.search(file_path);
}

module.exports = {
  config_from_path,
  find_local_config,
  get_module_path
};
