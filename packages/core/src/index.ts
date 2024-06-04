import { config_from_path, find_local_config, LegacyLinterConfig, LinterConfig } from "./read-config.js";
import Linter from "./linter.js";
import LegacyLinter from "./legacy/linter.js";
import { presets } from "./presets/index.js";
import rules from "./rules/index.js";
import * as messages from "./messages.js";

import path from "path";
import fs from "fs";
import { globbySync } from "globby";
import type { Ignore } from "ignore";
import ignore from "ignore";
import { EOL } from "os";
import type Issue from "./issue.js";

const DEFAULT_EXCLUDED_FOLDERS = ["!node_modules/"];

export interface FileLinter {
  file_path: string;
  preset: string | undefined;
  config_path: string | undefined;
  linter: LegacyLinter;
}

/**
 * The linthtml namespace.
 */
const linthtml = function (
  html: string,
  config: LegacyLinterConfig | LinterConfig
): Promise<{ content: string; issues: Issue[] }> {
  if (config?.rules !== undefined) {
    const linter = new Linter(config as LinterConfig);
    return linter.lint(html);
  }
  const linter = new LegacyLinter(null, config as LegacyLinterConfig);
  return linter.lint(html);
};

function fromConfig(config: LinterConfig): Linter;
function fromConfig(config: LegacyLinterConfig): LegacyLinter;
function fromConfig(config: LegacyLinterConfig | LinterConfig): Linter | LegacyLinter {
  if (config && config.rules !== undefined) {
    return new Linter(config as LinterConfig);
  }
  return new LegacyLinter(null, config as LegacyLinterConfig);
}
linthtml.fromConfig = fromConfig;

function get_files_to_lint(input: string[], config: LegacyLinterConfig | LinterConfig = {}): string[] {
  const ignore_config = read_dot_ignore_file();
  const ignore_files: string[] | undefined = config.ignoreFiles as string[] | undefined;
  const ignore_patterns = ignore_config || ignore_files;
  const file_paths = input.reduce(
    (paths, pattern) => [...paths, ...get_files_from_glob(pattern, ignore_patterns)],
    [] as string[]
  );
  return filter_ignored_files(file_paths, ignore_patterns);
}

function get_files_from_glob(glob_pattern: string, ignore_config: string | string[] | undefined): string[] {
  const use_default_ignore = ignore_config === undefined && path.isAbsolute(glob_pattern) === false;

  return globbySync([glob_pattern, ...DEFAULT_EXCLUDED_FOLDERS], {
    gitignore: use_default_ignore,
    expandDirectories: {
      files: ["**/*.html"],
      extensions: ["html"]
    }
  });
}

function filter_ignored_files(file_paths: string[], ignore_pattern?: string[]) {
  if (ignore_pattern === undefined) {
    return file_paths;
  }

  // Eslint not correctly getting types for ignorer here
  const ignorer = (ignore() as Ignore).add(ignore_pattern);
  return ignorer.filter(file_paths);
}

function read_dot_ignore_file(): string[] | undefined {
  const ignore_file_path = path.join(process.cwd(), ".linthtmlignore");
  if (fs.existsSync(ignore_file_path)) {
    return fs
      .readFileSync(ignore_file_path)
      .toString()
      .split(EOL)
      .filter((pattern) => pattern !== "");
  }
  return undefined;
}

function should_ignore_file(file_path: string, ignore_pattern: string[] = []) {
  if (ignore_pattern.length === 0) {
    return false;
  }
  // Eslint not correctly getting types for ignorer here
  const ignorer = (ignore() as Ignore).add(ignore_pattern);
  return ignorer.ignores(file_path);
}

function create_file_linter(
  file_path: string,
  config: {
    preset?: string;
    filepath?: string;
    config: LegacyLinterConfig | LinterConfig;
    fix?: boolean;
  }
): FileLinter {
  return {
    file_path,
    preset: config.preset,
    config_path: config.filepath,
    linter: linthtml.fromConfig({ ...config.config, fix: config.fix })
  };
}

/**
 * Create a linter per each file found using the globs provided
 *
 * @param {string[]} globs - An array of globs
 * @param {string} [config_path] - Path the config file that will be use to create configure the linters
 */
linthtml.create_linters_for_files = async function (
  globs: string[],
  config_path?: string,
  fix?: boolean
): Promise<FileLinter[]> {
  if (config_path) {
    const config = await config_from_path(config_path);
    const files = get_files_to_lint(globs, config.config);
    return files.map((file_path) => create_file_linter(file_path, { ...config, fix }));
  }
  const files = get_files_to_lint(globs);
  const files_config = await Promise.all(
    files.map((file_path) => find_local_config(file_path).then((config) => ({ file_path, config })))
  );
  return files_config.reduce((files_to_lint, { file_path, config }) => {
    // if no config, fallback to presets as before
    const local_config = config ?? {
      config: presets.default as LinterConfig | LegacyLinterConfig,
      preset: "default"
    };

    if (!should_ignore_file(file_path, local_config.config.ignoreFiles as string[])) {
      return files_to_lint.concat(create_file_linter(file_path, { ...local_config, fix }));
    }
    return files_to_lint;
  }, [] as FileLinter[]);
};

linthtml.from_config_path = async function (config_path: string, fix?: boolean): Promise<Linter | LegacyLinter> {
  const config = await config_from_path(config_path);
  return linthtml.fromConfig({ ...config.config, fix });
};

linthtml.Linter = Linter;
linthtml.LegacyLinter = LegacyLinter;
linthtml.rules = rules;
linthtml.presets = presets;
linthtml.messages = messages;

export default linthtml;

export { config_from_path, find_local_config, LegacyLinterConfig, LinterConfig };
