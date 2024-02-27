import yaml from "js-yaml";
import linthtml from "@linthtml/linthtml";
import fs from "fs";
import chalkTemplate from "chalk-template";
import inquirer from "inquirer";

import type { LegacyLinterConfig, LinterConfig } from "@linthtml/linthtml/read-config";

const default_config = {
  "text-ignore-regex": false,
  "raw-ignore-regex": false,
  "attr-name-ignore-regex": false,
  "id-class-ignore-regex": false,
  "line-max-len-ignore-regex": false,
  rules: {}
} satisfies LinterConfig;

const GENERATORS = {
  JavaScript: {
    name: ".linthtmlrc.js",
    generate_content: (content: LegacyLinterConfig | LinterConfig) =>
      `module.exports = ${JSON.stringify(content, null, "\t")}`
  },
  JSON: {
    name: ".linthtmlrc.json",
    generate_content: (content: LinterConfig | LegacyLinterConfig) => JSON.stringify(content, null, "\t")
  },
  YAML: {
    name: ".linthtmlrc.yaml",
    generate_content: (content: LinterConfig | LegacyLinterConfig) => yaml.dump(content)
  }
};

export default async function init_command(): Promise<void> {
  const response: { format: "JavaScript" | "YAML" | "JSON"; legacy: boolean } = await inquirer.prompt([
    {
      type: "list",
      name: "format",
      message: "What format do you want your config file to be in?",
      default: "Javascript",
      choices: ["JavaScript", "YAML", "JSON"]
    },
    {
      type: "list",
      name: "legacy",
      message: "Do you want to use the new config format or the legacy?",
      choices: [
        {
          name: "New format",
          value: false
        },
        {
          name: "Legacy (inherited from HTMLLint)",
          value: true
        }
      ]
    }
  ]);

  const config_file = GENERATORS[response.format];
  console.log();
  if (response.legacy) {
    fs.writeFileSync(config_file.name, config_file.generate_content(linthtml.presets.default), "utf8");
  } else {
    fs.writeFileSync(config_file.name, config_file.generate_content(default_config), "utf8");
    console.log(chalkTemplate`⚠️ {yellow The new format does not provide default configurations for rules}`);
  }
  console.log(chalkTemplate`Successfully created {blue ${config_file.name}} file in {underline ${process.cwd()}}`);
}
