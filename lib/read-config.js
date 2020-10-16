const { cosmiconfigSync } = require("cosmiconfig");
const path = require("path");
const fs = require("fs");
const CustomError = require("./utils/custom-errors");

const globalModules = require("global-modules");
const resolveFrom = require("resolve-from");

/**
 * @param {string} basedir
 * @param {string} lookup
 * @return {string}
 */
function getModulePath(basedir, lookup) {
  // 1. Try to resolve from the provided directory
  // 2. Try to resolve from `process.cwd`
  // 3. Try to resolve from global `node_modules` directory
  let path = resolveFrom.silent(basedir, lookup);

  if (!path) {
    path = resolveFrom.silent(process.cwd(), lookup);
  }

  if (!path) {
    path = resolveFrom.silent(globalModules, lookup);
  }

  if (!path) {
    // Custom ClI-error instead
    throw configurationError(`Could not find "${lookup}". Do you need a \`configBasedir\`?`);
  }

  return path;
}

function mergeConfigs(a, b) {
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
 * @param {CosmiconfigResult} cosmiconfigResult
 * @return {CosmiconfigResult}
 */
function augmentConfig(cosmiconfigResult) {
  if (!cosmiconfigResult) {
    return null;
  }

  const configDir = path.dirname(cosmiconfigResult.filepath || "");
  const { ignoreFiles, ...config } = cosmiconfigResult.config;
  if (config.extends) {
    const normalizedExtends = Array.isArray(config.extends) // throw an error if not string or array
      ? config.extends
      : [config.extends];

    const extendedConfig = normalizedExtends.reduce((extendedConfig, extendsPath) => {
      const configResult = loadExtendedConfig(extendsPath, configDir);
      return mergeConfigs(extendedConfig, configResult);
    }, {});

    return {
      filepath: cosmiconfigResult.filepath,
      config: mergeConfigs(
        extendedConfig,
        config
      )
    };
  }
  return cosmiconfigResult;
}
/**
 * @param {object} extendsPath
 * @param {string} configDir
 * @return {CosmiconfigResult}
 */
function loadExtendedConfig(extendsPath, configDir) {
  const extendPath = getModulePath(configDir, extendsPath);
  // create cosmiconfigSync only once ?
  const cosmiconfigResult = cosmiconfigSync(null, { transform: augmentConfig }).load(extendPath);
  return cosmiconfigResult
    ? cosmiconfigResult.config
    : null;
}

module.exports.config_from_path = function(file_path) {
  const config_path = path.resolve(process.cwd(), file_path);
  let isConfigDirectory = false;
  try {
    let config = null;
    isConfigDirectory = fs.lstatSync(config_path).isDirectory();
    if (isConfigDirectory) {
      // stopDir: config_path needed?
      // create cosmiconfigSync only once ?
      config = cosmiconfigSync("linthtml", {
        stopDir: config_path,
        packageProp: "linthtmlConfig",
        transform: augmentConfig
      }).search(config_path);
    } else {
      config = explorer.load(config_path);
    }
    if (config === null) {
      throw new Error();
    }
    return config;
  } catch (error) {
    if (isConfigDirectory) {
      throw new CustomError("CLI-01", { config_path });
    }
    throw new CustomError("CLI-02", { config_path });
  }
};

const explorer = cosmiconfigSync("linthtml", {
  /* stopDir: process.cwd(), */
  packageProp: "linthtmlConfig",
  transform: augmentConfig
});

module.exports.find_local_config = function(file_path) {
  return explorer.search(file_path);
};
