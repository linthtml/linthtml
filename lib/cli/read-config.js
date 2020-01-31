const { cosmiconfigSync } = require("cosmiconfig");
const path = require("path");
const fs = require("fs");
const CustomError = require("../utils/custom-errors");

const explorer = cosmiconfigSync("linthtml", { stopDir: process.cwd(), packageProp: "linthtmlConfig" });

module.exports.config_from_path = function(file_path) {
  const config_path = path.join(process.cwd(), file_path);
  let isConfigDirectory = false;
  try {
    let config = null;
    isConfigDirectory = fs.lstatSync(config_path).isDirectory();
    if (isConfigDirectory) {
      config = cosmiconfigSync("linthtml", { stopDir: config_path, packageProp: "linthtmlConfig" }).search(config_path);
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
      // console.log(`{red Error:} Cannot read config file in directory: {underline ${config_path}}`);
    }
    throw new CustomError("CLI-02", { config_path });
  }
};

module.exports.find_local_config = function() {
  return explorer.search();
};
