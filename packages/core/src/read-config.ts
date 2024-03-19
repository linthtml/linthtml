import path from "path";
import fs from "fs";

import { cosmiconfig } from "cosmiconfig";
import { Config, CosmiconfigResult } from "cosmiconfig/dist/types.js";
import globalModules from "global-modules";
import resolveFrom from "resolve-from";

import CustomError from "./utils/custom-errors.js";
import Issue from "./issue.js";
import { Node, Range } from "@linthtml/dom-utils/dom_elements";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const IS_TEST = process.env.NODE_ENV === "test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STOP_DIR = IS_TEST ? path.resolve(__dirname, "..") : undefined;

export type reportFunction = (data: {
  code: string;
  position: Range;
  meta?: Record<string, unknown>;
  message?: string;
}) => void;

// TODO: Move every types in the same file?
// TODO: RuleDefinition<ConfigType> ?
export interface RuleDefinition {
  name: string;
  lint: (
    node: Node,
    rule_config: unknown,
    obj: {
      report: reportFunction;
      // eslint-disable-next-line no-use-before-define
      rules: Record<string, ActiveRuleDefinition>;
      global_config: Record<string, unknown>;
    }
  ) => void;
  // TODO: Why <T> ? T should be on RuleDefinition
  validateConfig?: <T>(option: T) => void | never;

  configTransform?: (option: unknown) => unknown; // remove for v1
  filter?: string[]; // remove for v1
  end?: (opts?: unknown) => Issue[]; // remove for v1
}

export type ActiveRuleDefinition = RuleDefinition & {
  severity: "warning" | "error";
  config: unknown;
};

export type RuleSeverity = "warning" | "error";
export type RuleActivation = boolean | RuleSeverity | "off";

// TODO: Fix type (["error"] is reporting typescript error in tests)
export type RuleConfig = RuleActivation | [RuleActivation] | [RuleActivation, unknown];

// TODO: Remove boolean type for x-regex config
export type LinterConfig = {
  extends?: string | string[];
  plugins?: string[];
  parser?: string;
  ignoreFiles?: string[];

  maxerr?: number;
  "text-ignore-regex"?: string | RegExp | false;
  "raw-ignore-regex"?: string | RegExp | false;
  "attr-name-ignore-regex"?: string | RegExp | false;
  "id-class-ignore-regex"?: string | RegExp | false;
  "line-max-len-ignore-regex"?: string | RegExp | false;

  plugins_rules?: {
    [rules_name: string]: RuleDefinition;
  };
  rules?: {
    [rule_name: string]: RuleConfig;
  };
};

export interface PluginConfig {
  rules?: RuleDefinition[];
}

export type LegacyRuleOption = Partial<RuleDefinition> & {
  name: string;
  active?: boolean;
  rules: string[];
};

export type LegacyRuleDefinition = RuleDefinition & {
  options: LegacyRuleOption[];
  on: string;
  subscribers: LegacyRuleDefinition[];
};

export interface LegacyLinterConfig {
  maxerr?: number;
  "text-ignore-regex"?: string | RegExp | false;
  "raw-ignore-regex"?: string | RegExp | false;
  "attr-name-ignore-regex"?: string | RegExp | false;
  "id-class-ignore-regex"?: string | RegExp | false;
  "line-max-len-ignore-regex"?: string | RegExp | false;

  [rule_name: string]: boolean | unknown;
}

export interface ExtractConfigResult {
  filepath: string;
  isEmpty?: boolean | undefined;
  config: LinterConfig | LegacyLinterConfig;
}

function get_module_path(basedir: string, module_name: string): string | never {
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

function merge_configs(a: LinterConfig, b: Partial<LinterConfig>): LinterConfig {
  let plugins: string[] = [];

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
async function augment_config(cosmiconfig_result: CosmiconfigResult): Promise<ExtractConfigResult | null> {
  if (!cosmiconfig_result) {
    return null;
  }

  const config_dir = path.dirname(cosmiconfig_result.filepath || "");
  const { ignoreFiles = [], ...config }: LinterConfig = cosmiconfig_result.config;
  let result = {
    filepath: cosmiconfig_result.filepath,
    config
  };

  if (config.extends) {
    const normalized_extends = Array.isArray(config.extends) // throw an error if not string or array
      ? config.extends
      : [config.extends];
    const extended_configs = await Promise.all(
      normalized_extends.map((extends_path) => load_extended_config(extends_path, config_dir))
    );
    const extended_config = extended_configs.reduce(merge_configs, {} as LinterConfig);

    result = {
      filepath: result.filepath,
      config: merge_configs(extended_config, result.config as LinterConfig)
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
async function load_extended_config(extends_path: string, config_dir: string): Promise<LinterConfig> {
  const extendPath = get_module_path(config_dir, extends_path);
  // @ts-expect-error TODO fix (use "linthtml" ?
  const cosmiconfig_result = await cosmiconfig(null, {
    stopDir: STOP_DIR,
    transform: augment_config
  }).load(extendPath);
  return cosmiconfig_result ? cosmiconfig_result.config : null;
}

/**
 * @param {Object} rule_definition
 * @param {string} plugin_name
 * @throws {CustomError}
 */
function check_plugin_rule(rule_definition: { name?: string; lint?: unknown }, plugin_name: string): void | never {
  if (!rule_definition.name) {
    throw new CustomError("CORE-06", { plugin_name });
  }

  if (!rule_definition.name.includes("/")) {
    throw new CustomError("CORE-07", {
      rule_name: rule_definition.name,
      plugin_name
    });
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
function load_plugin(plugin_name: string): PluginConfig | never {
  try {
    // TODO: Switch to import
    // Eslint Typescript recommend using import statement but import return a promise.
    const require = createRequire(import.meta.url);
    const plugin_import = require(plugin_name);
    // const plugin_import = await import(plugin_name);
    // Handle either ES6 or CommonJS modules
    return plugin_import.default || plugin_import;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ERR_REQUIRE_ESM") {
      throw new CustomError("CORE-10", { module_name: plugin_name });
    }
    throw new CustomError("CORE-05", { module_name: plugin_name });
  }
}

/**
 * @param {CosmiconfigResult} cosmiconfig_result
 * @returns {CosmiconfigResult}
 * @throws {CustomError}
 */
function add_plugins_rules(cosmiconfig_result: {
  config: Config;
  filepath: string;
  isEmpty?: boolean | undefined;
}): ExtractConfigResult | never {
  if (cosmiconfig_result.config.plugins) {
    const normalized_plugins: string[] = Array.isArray(cosmiconfig_result.config.plugins) // throw an error if not string or array
      ? cosmiconfig_result.config.plugins
      : [cosmiconfig_result.config.plugins];

    const plugins_rules: Record<string, RuleDefinition> = normalized_plugins.reduce(
      (plugin_rules: Record<string, RuleDefinition>, plugin_name) => {
        const { rules } = load_plugin(plugin_name);

        if (rules && !Array.isArray(rules)) {
          throw new CustomError("CORE-09", { plugin_name });
        }

        (rules ?? []).forEach((rule_definition) => {
          check_plugin_rule(rule_definition, plugin_name);
          plugin_rules[rule_definition.name] = rule_definition;
        });

        return plugin_rules;
      },
      {}
    );

    return {
      ...cosmiconfig_result,
      config: merge_configs(
        cosmiconfig_result.config,
        { plugins_rules } // use partial type?
      )
    };
  }

  return cosmiconfig_result;
}

const explorer = cosmiconfig("linthtml", {
  stopDir: STOP_DIR,
  // searchStrategy: "global", // TODO: Add or remove when migrating to cosmiconfig v9
  packageProp: "linthtmlConfig",
  transform: augment_config
});

async function config_from_path(file_path: string): Promise<ExtractConfigResult | never> {
  const config_path = path.resolve(process.cwd(), file_path);
  let isconfig_directory = false;
  try {
    let config = null;
    isconfig_directory = fs.lstatSync(config_path).isDirectory();
    if (isconfig_directory) {
      // stopDir: config_path needed?
      // create cosmiconfigSync only once ?
      config = await explorer.search(config_path);
    } else {
      config = await explorer.load(config_path);
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

async function find_local_config(file_path: string): Promise<ExtractConfigResult | null> | never {
  const config = await explorer.search(file_path);
  return config ? add_plugins_rules(config) : null;
}

export { config_from_path, find_local_config, get_module_path };
