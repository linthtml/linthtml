import { config_from_path, find_local_config, LegacyLinterConfig, LinterConfig } from "./read-config";
import Linter from "./linter";
import LegacyLinter from "./legacy/linter";
import { presets } from "./presets";
import rules from "./rules";

import path from "path";
import fs from "fs";
import globby from "globby";
import ignore from "ignore";
import Issue from "./issue";

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
const linthtml = function (html: string, config: LegacyLinterConfig | LinterConfig): Promise<Issue[]> {
  if (config?.rules !== undefined) {
    const linter = new Linter(config as LinterConfig);
    return linter.lint(html);
  }
  const linter = new LegacyLinter(null, config as LegacyLinterConfig);
  // @ts-ignore
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
  const ignoreFiles: string[] | undefined = config.ignoreFiles as string[] | undefined;
  const ignore_patterns = ignore_config || ignoreFiles;
  const file_paths = input.reduce(
    (paths, pattern) => [...paths, ...get_files_from_glob(pattern, ignore_patterns)],
    [] as string[]
  );
  return filter_ignored_files(file_paths, ignore_patterns);
}

function get_files_from_glob(glob_pattern: string, ignore_config: string | string[] | undefined): string[] {
  const use_default_ignore = ignore_config === undefined && path.isAbsolute(glob_pattern) === false;

  return globby.sync([glob_pattern, ...DEFAULT_EXCLUDED_FOLDERS], {
    gitignore: use_default_ignore,
    expandDirectories: {
      files: ["**/*.html"],
      extensions: ["html"]
    }
  });
}

function filter_ignored_files(file_paths: string[], ignore_pattern: string | string[] | undefined) {
  if (ignore_pattern === undefined) {
    return file_paths;
  }

  // @ts-ignore
  const ignorer = ignore().add(ignore_pattern);
  return ignorer.filter(file_paths);
}

function read_dot_ignore_file(): string | undefined {
  const ignore_file_path = path.join(process.cwd(), ".linthtmlignore");
  if (fs.existsSync(ignore_file_path)) {
    return fs.readFileSync(ignore_file_path).toString();
  }
  return undefined;
}

function should_ignore_file(file_path: string, ignore_pattern: string[] | undefined) {
  if (ignore_pattern === undefined) {
    return false;
  }
  const ignorer = ignore().add(ignore_pattern);
  return ignorer.ignores(file_path);
}

function create_file_linter(
  file_path: string,
  config: {
    preset?: string;
    filepath?: string;
    config: LegacyLinterConfig | LinterConfig;
  }
): FileLinter {
  return {
    file_path,
    preset: config.preset,
    config_path: config.filepath,
    linter: linthtml.fromConfig(config.config)
  };
}

/**
 * Create a linter per each file found using the globs provided
 *
 * @param {string[]} globs - An array of globs
 * @param {string} [config_path] - Path the config file that will be use to create configure the linters
 */
linthtml.create_linters_for_files = function (globs: string[], config_path?: string): FileLinter[] {
  if (config_path) {
    const config = config_from_path(config_path);
    const files = get_files_to_lint(globs, config.config);
    return files.map((file_path) => create_file_linter(file_path, config));
  }
  const files = get_files_to_lint(globs);
  return files.reduce((files_to_lint, file_path) => {
    let config: any = find_local_config(file_path);

    // TODO find a way to replace any
    if (!config) {
      config = {
        config: presets.default as LinterConfig | LegacyLinterConfig,
        preset: "default"
      };
    }
    // if no config fallback to presets as before
    if (!should_ignore_file(file_path, config.config.ignoreFiles as string[] | undefined)) {
      return files_to_lint.concat(create_file_linter(file_path, config));
    }
    return files_to_lint;
  }, [] as FileLinter[]);
};

linthtml.from_config_path = function (config_path: string): Linter | LegacyLinter {
  const config = config_from_path(config_path);
  return linthtml.fromConfig(config.config);
};

linthtml.Linter = Linter;
linthtml.LegacyLinter = LegacyLinter;
linthtml.rules = rules;
linthtml.presets = presets;

export default linthtml;

export { config_from_path, find_local_config, LegacyLinterConfig, LinterConfig };
