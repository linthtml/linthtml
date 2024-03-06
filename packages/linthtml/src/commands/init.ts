import yaml from "js-yaml";
import linthtml from "@linthtml/core";
import fs from "fs";
import chalkTemplate from "chalk-template";
import inquirer from "inquirer";

import type { LegacyLinterConfig, LinterConfig } from "@linthtml/core/read-config";

const default_config = {
  "text-ignore-regex": false,
  "raw-ignore-regex": false,
  "attr-name-ignore-regex": false,
  "id-class-ignore-regex": false,
  "line-max-len-ignore-regex": false,
  rules: {}
} satisfies LinterConfig;

const GENERATORS = {
  TS: {
    name: ".linthtmlrc.ts",
    generate_content: (content: LegacyLinterConfig | LinterConfig, isLegacyConfig = false) => {
      const type_import = isLegacyConfig ? "LegacyConfig" : "Config";
      return `import type { ${type_import} } from '@linthtml/linthtml';\n\nexport default ${JSON.stringify(
        content,
        null,
        "\t"
      )} satisfies ${type_import};`;
    }
  },
  CJS: {
    name: ".linthtmlrc.cjs",
    generate_content: (content: LegacyLinterConfig | LinterConfig, isLegacyConfig = false) => {
      const type_import = isLegacyConfig ? "LegacyConfig" : "Config";

      return `/** @type {import('@linthtml/linthtml').${type_import}}*/\nmodule.exports = ${JSON.stringify(
        content,
        null,
        "\t"
      )}`;
    }
  },
  ESM: {
    name: ".linthtmlrc.mjs",
    generate_content: (content: LegacyLinterConfig | LinterConfig, isLegacyConfig = false) => {
      const type_import = isLegacyConfig ? "LegacyConfig" : "Config";

      return `/** @type {import('@linthtml/linthtml').${type_import}}*/\nexport default ${JSON.stringify(
        content,
        null,
        "\t"
      )}`;
    }
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
  const response: { format: keyof typeof GENERATORS; legacy: boolean } = await inquirer.prompt([
    {
      type: "list",
      name: "format",
      message: "What format do you want your config file to be in?",
      default: "Javascript",
      choices: [
        { name: "JavaScript (commonjs)", value: "CJS" },
        { name: "Javascript (esm)", value: "ESM" },
        { name: "Typescript", value: "TS" },
        { name: "YAML", value: "YAML" },
        { name: "JSON", value: "JSON" }
      ]
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
    fs.writeFileSync(config_file.name, config_file.generate_content(linthtml.presets.default, true), "utf8");
  } else {
    fs.writeFileSync(config_file.name, config_file.generate_content(default_config), "utf8");
    console.log(chalkTemplate`⚠️ {yellow The new format does not provide default configurations for rules}`);
  }
  console.log(chalkTemplate`Successfully created {blue ${config_file.name}} file in {underline ${process.cwd()}}`);
}
