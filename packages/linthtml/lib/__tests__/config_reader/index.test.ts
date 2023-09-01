// TODO: Find a way to reset jest mocks correctly
// https://jestjs.io/docs/es6-class-mocks#complete-example ?
import path from "path";
import type { LinterConfig } from "../../read-config";
import { config_from_path, find_local_config } from "../../read-config";
import CustomError from "../../utils/custom-errors";

class NoErrorThrownError extends Error {}

function getError<TError>(fn: () => unknown): TError {
  try {
    fn();
    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
}

describe("Get config from path", () => {
  it("Report an error if path provided does not exist", () => {
    const error = getError(() => config_from_path("unknow_file"));

    expect(error).toBeInstanceOf(CustomError);
    expect(error).toHaveProperty("code", "CORE-02");
    expect(error).toHaveProperty("meta", {
      config_path: path.join(process.cwd(), "unknow_file")
    });
  });

  it("Report an error when there's no config file in the folder provided", () => {
    const error = getError(() => config_from_path(__dirname));

    expect(error).toBeInstanceOf(CustomError);
    expect(error).toHaveProperty("code", "CORE-01");
    expect(error).toHaveProperty("meta", {
      config_path: __dirname
    });
  });

  it("Return the config object from cosmiconfig if config file exist", () => {
    const config_path = path.join(__dirname, "fixtures", ".linthtmlrc.js");
    const config = config_from_path(config_path);
    expect(config).toHaveProperty("config");
    expect(config).toHaveProperty("filepath", config_path);
  });

  it("Return the config object from cosmiconfig if there's a config file in the folder provided", () => {
    const config_path = path.join(__dirname, "fixtures");
    const config = config_from_path(config_path);
    expect(config).toHaveProperty("config");
    expect(config).toHaveProperty("filepath", path.join(config_path, ".linthtmlrc.js"));
  });
});

// Start by searching in the file folder, then search in the parent folder and the parent folder (...) until it reach the root directory
describe("Find config file for a file path", () => {
  it("Return not nothing if it cannot find a config file", () => {
    const config = find_local_config(__dirname);
    expect(config).toBeNull();
  });

  it("Return the config object from cosmiconfig if there's a config file in the file folder", () => {
    const config_path = path.join(__dirname, "fixtures");
    const config = find_local_config(config_path);
    expect(config).toHaveProperty("config");
    expect(config).toHaveProperty("filepath", path.join(config_path, ".linthtmlrc.js"));
  });

  it("Return the config object from cosmiconfig if there's a config file in parent folder", () => {
    const config_path = path.join(__dirname, "fixtures", "pages");
    const config = find_local_config(config_path);
    expect(config).toHaveProperty("config");
    expect(config).toHaveProperty("filepath", path.join(__dirname, "fixtures", ".linthtmlrc.js"));
  });
});

describe("Load extends config", () => {
  it("Load and merge configs", () => {
    const config_path = path.join(__dirname, "fixtures", "valid-extends.js");
    const { config } = config_from_path(config_path);
    expect(config).toEqual({
      extends: ["./config-attr-bans"],
      plugins: [],
      plugins_rules: {},
      ignoreFiles: [],
      rules: {
        "attr-bans": true
      }
    });
  });

  it("Throw an error extended config does not exist", () => {
    const config_path = path.join(__dirname, "fixtures", "invalid-extends.js");

    const error = getError(() => config_from_path(config_path));

    expect(error).toBeInstanceOf(CustomError);
    expect(error).toHaveProperty("code", "CORE-03");
    expect(error).toHaveProperty("meta", {
      module_name: "./foo"
    });
  });

  it("'extends' accept a string only", () => {
    const config_path = path.join(__dirname, "fixtures", "valid-extends-string-only.js");
    const { config } = config_from_path(config_path);
    expect(config).toEqual({
      extends: "./config-attr-bans",
      plugins: [],
      plugins_rules: {},
      ignoreFiles: [],
      rules: {
        "attr-bans": true
      }
    });
  });

  it("Rules settings from config file and extends are merged", () => {
    const config_path = path.join(__dirname, "fixtures", "extends-merged-rules-settings.js");
    const { config } = config_from_path(config_path);
    expect(config).toEqual({
      extends: ["./config-attr-bans", "./config-tag-bans"],
      plugins: [],
      plugins_rules: {},
      ignoreFiles: [],
      rules: {
        "attr-bans": true,
        "indent-style": [true, "spaces"],
        "tag-bans": [true, "style", "b", "i"]
      }
    });
  });

  it("Rule settings from config file overrides rule settings form extends", () => {
    const config_path = path.join(__dirname, "fixtures", "extends-with-overrides.js");
    const { config } = config_from_path(config_path);
    expect(config).toEqual({
      extends: ["./config-attr-bans", "./config-tag-bans"],
      plugins: [],
      plugins_rules: {},
      ignoreFiles: [],
      rules: {
        "attr-bans": "off",
        "tag-bans": [true, "style", "b", "i"]
      }
    });
  });

  // Add function to load_extends from given config object (not only paths)?
});

describe("Load plugins", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("Load and merge rules from plugins", () => {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.js");
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.js");
    const { config } = config_from_path(config_path);
    expect((config as LinterConfig).plugins).toEqual([plugin_path]);
    expect((config as LinterConfig).plugins_rules).not.toBeNull();
    expect((config as LinterConfig).plugins_rules?.["my-plugin/rule"]).toHaveProperty("name", "my-plugin/rule");
    expect((config as LinterConfig).plugins_rules?.["my-plugin/rule"].lint).toBeInstanceOf(Function);
  });
  it("Throw an error when plugins rules property is not an array", async () => {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.js");

    jest.mock(path.join(__dirname, "fixtures", "plugin.js"), () => {
      return {
        rules: {}
      };
    });
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.js");

    const error = getError(() => config_from_path(config_path));

    expect(error).toBeInstanceOf(CustomError);
    expect(error).toHaveProperty("code", "CORE-09");
    expect(error).toHaveProperty("meta", {
      plugin_name: plugin_path
    });
  });
  it("Throw an error when rule does not have a name", () => {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.js");
    jest.mock(path.join(__dirname, "fixtures", "plugin.js"), () => {
      return {
        rules: [{}]
      };
    });
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.js");
    const error = getError(() => config_from_path(config_path));

    expect(error).toBeInstanceOf(CustomError);
    expect(error).toHaveProperty("code", "CORE-06");
    expect(error).toHaveProperty("meta", {
      plugin_name: plugin_path
    });
  });
  it("Throw an error when rule's name is not prefixed", () => {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.js");
    jest.mock(path.join(__dirname, "fixtures", "plugin.js"), () => {
      return {
        rules: [
          {
            name: "my-rule"
          }
        ]
      };
    });
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.js");
    const error = getError(() => config_from_path(config_path));

    expect(error).toBeInstanceOf(CustomError);
    expect(error).toHaveProperty("code", "CORE-07");
    expect(error).toHaveProperty("meta", {
      plugin_name: plugin_path,
      rule_name: "my-rule"
    });
  });
  it("Throw an error when rule does not have a lint function", () => {
    jest.mock(path.join(__dirname, "fixtures", "plugin.js"), () => {
      return {
        rules: [
          {
            name: "my/my-rule"
          }
        ]
      };
    });
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.js");
    const error = getError(() => config_from_path(config_path));

    expect(error).toBeInstanceOf(CustomError);
    expect(error).toHaveProperty("code", "CORE-08");
    expect(error).toHaveProperty("meta", {
      rule_name: "my/my-rule"
    });
  });
  it("Throw an error when rule does not have a lint function", () => {
    const config_path = path.join(__dirname, "fixtures", "invalid-config-plugin.js");
    const error = getError(() => config_from_path(config_path));

    expect(error).toBeInstanceOf(CustomError);
    expect(error).toHaveProperty("code", "CORE-05");
    expect(error).toHaveProperty("meta", {
      module_name: "foo"
    });
  });
});
