const yaml = require("js-yaml");
const presets = require("../../presets").presets;
const fs = require("fs");
const chalk = require("chalk");
const inquirer = require("inquirer");

const default_config = {
  maxerr: false,
  "text-ignore-regex": false,
  "raw-ignore-regex": false,
  "attr-name-ignore-regex": false,
  "id-class-ignore-regex": false,
  "line-max-len-ignore-regex": false,
  rules: {}
};

const GENERATORS = {
  JavaScript: {
    name: ".linthtmlrc.js",
    generate_content: (content) => `module.exports = ${JSON.stringify(content, null, "\t")}`
  },
  JSON: {
    name: ".linthtmlrc.json",
    generate_content: (content) => JSON.stringify(content, null, "\t")
  },
  YAML: {
    name: ".linthtmlrc.yaml",
    generate_content: (content) => yaml.dump(content)
  }
};

module.exports = async function() {
  const response = await inquirer.prompt([{
    type: "list",
    name: "format",
    message: "What format do you want your config file to be in?",
    default: "Javascript",
    choices: ["JavaScript", "YAML", "JSON"]
  }, {
    type: "list",
    name: "legacy",
    message: "Do you want to use the new config format or the legacy?",
    choices: [{
      name: "New format",
      value: false
    }, {
      name: "Legacy (inherited from HTMLLint)",
      value: true
    }]
  }]);

  const config_file = GENERATORS[response.format];
  if (response.legacy) {
    fs.writeFileSync(config_file.name, config_file.generate_content(presets.default), "utf8");
  } else {
    fs.writeFileSync(config_file.name, config_file.generate_content(default_config), "utf8");
    console.log(chalk`⚠️ {yellow The new format does not provide default configurations for rules}`);
  }
  console.log(chalk`Successfully created {blue ${config_file.name}} file in {underline ${process.cwd()}}`);
};
