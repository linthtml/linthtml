const promtps = require("prompts");
const yaml = require("yaml");
const presets = require("../../presets").presets;
const fs = require("fs");
const chalk = require("chalk");

const RULES_JSON = JSON.stringify(presets.default, null, "\t");
const GENERATORS = {
  JS: {
    name: ".linthtmlrc.js",
    content: `module.exports = ${RULES_JSON}`
  },
  JSON: {
    name: ".linthtmlrc.json",
    content: RULES_JSON
  },
  YAML: {
    name: ".linthtmlrc.yaml",
    content: yaml.stringify(presets.default)
  }
};

module.exports = async function() {
  const response = await promtps({
    type: "select",
    name: "format",
    message: "What format do you want your config file to be in?",
    choices: [{
      title: "Javascript",
      value: "JS"
    }, {
      title: "YAML",
      value: "YAML"
    }, {
      title: "JSON",
      value: "JSON"
    }]
  });
  const config_file = GENERATORS[response.format];
  fs.writeFileSync(config_file.name, config_file.content, "utf8");
  console.log(chalk`Successfully created {blue ${config_file.name}} file in {underline ${process.cwd()}}`);
};
