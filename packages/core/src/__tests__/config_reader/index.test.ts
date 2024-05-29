import { expect } from "chai";
// TODO: Get rid of .js import requiremock import
import rewiremock from "rewiremock/node.js";
import path from "path";
import type { LinterConfig } from "../../read-config.js";
import { config_from_path, find_local_config } from "../../read-config.js";
import { fileURLToPath } from "url";
import module from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Get config from path", function () {
  it("Report an error if path provided does not exist", async function () {
    try {
      await config_from_path("unknow_file");
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-02");
      expect(error).to.have.deep.property("meta", {
        config_path: path.join(process.cwd(), "unknow_file")
      });
    }
  });

  it("Report an error when there's no config file in the folder provided", async function () {
    let assertions_runned = false;
    try {
      await config_from_path(__dirname);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-01");
      expect(error).to.have.deep.property("meta", {
        config_path: __dirname
      });
      assertions_runned = true;
    }

    expect(assertions_runned).to.be.true;
  });

  it("Return the config object from cosmiconfig if config file exist", async function () {
    const config_path = path.join(__dirname, "fixtures", ".linthtmlrc.cjs");
    const config = await config_from_path(config_path);
    expect(config).to.have.property("config");
    expect(config).to.have.property("filepath", config_path);
  });

  it("Return the config object from cosmiconfig if there's a config file in the folder provided", async function () {
    const config_path = path.join(__dirname, "fixtures");
    const config = await config_from_path(config_path);
    expect(config).to.have.property("config");
    expect(config).to.have.property("filepath", path.join(config_path, ".linthtmlrc.cjs"));
  });
});

// Start by searching in the file folder, then search in the parent folder and the parent folder (...) until it reach the root directory
describe("Find config file for a file path", function () {
  it("Return nothing if it cannot find a config file", async function () {
    const config = await find_local_config(__dirname);
    expect(config).to.be.null;
  });

  it("Return the config object from cosmiconfig if there's a config file in the file folder", async function () {
    const config_path = path.join(__dirname, "fixtures");
    const config = await find_local_config(config_path);
    expect(config).to.have.property("config");
    expect(config).to.have.property("filepath", path.join(config_path, ".linthtmlrc.cjs"));
  });

  it("Return the config object from cosmiconfig if there's a config file in parent folder", async function () {
    const config_path = path.join(__dirname, "fixtures", "pages");
    const config = await find_local_config(config_path);
    expect(config).to.have.property("config");
    expect(config).to.have.property("filepath", path.join(__dirname, "fixtures", ".linthtmlrc.cjs"));
  });
});

describe("Load extends config", function () {
  it("Load and merge configs", async function () {
    const config_path = path.join(__dirname, "fixtures", "valid-extends.cjs");
    const { config } = await config_from_path(config_path);
    expect(config).to.deep.equal({
      extends: ["./config-attr-bans.cjs"],
      plugins: [],
      plugins_rules: {},
      ignoreFiles: [],
      rules: {
        "attr-bans": true
      }
    });
  });

  it("Throw an error if extended config does not exist", async function () {
    const config_path = path.join(__dirname, "fixtures", "invalid-extends.cjs");

    try {
      await config_from_path(config_path);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-03");
      expect(error).to.have.deep.property("meta", {
        module_name: "./foo"
      });
    }
  });

  it("'extends' accept a string only", async function () {
    const config_path = path.join(__dirname, "fixtures", "valid-extends-string-only.cjs");
    const { config } = await config_from_path(config_path);
    expect(config).to.deep.equal({
      extends: "./config-attr-bans.cjs",
      plugins: [],
      plugins_rules: {},
      ignoreFiles: [],
      rules: {
        "attr-bans": true
      }
    });
  });

  it("Rules settings from config file and extends are merged", async function () {
    const config_path = path.join(__dirname, "fixtures", "extends-merged-rules-settings.cjs");
    const { config } = await config_from_path(config_path);
    expect(config).to.deep.equal({
      extends: ["./config-attr-bans.cjs", "./config-tag-bans.cjs"],
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

  it("Rule settings from config file overrides rule settings form extends", async function () {
    const config_path = path.join(__dirname, "fixtures", "extends-with-overrides.cjs");
    const { config } = await config_from_path(config_path);
    expect(config).to.deep.equal({
      extends: ["./config-attr-bans.cjs", "./config-tag-bans.cjs"],
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

describe("Load plugins", function () {
  it("Load and merge rules from CJS plugins", async function () {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.cjs");
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.cjs");
    const { config } = await config_from_path(config_path);

    expect((config as LinterConfig).plugins).to.deep.equal([plugin_path]);
    expect((config as LinterConfig).plugins_rules).to.not.be.null;
    expect((config as LinterConfig).plugins_rules?.["my-plugin/rule"]).to.have.property("name", "my-plugin/rule");
    expect((config as LinterConfig).plugins_rules?.["my-plugin/rule"].lint).to.be.a("function");
  });

  it("Load and merge rules from ESM plugins", async function () {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.mjs");
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.mjs");
    const { config } = await config_from_path(config_path);

    expect((config as LinterConfig).plugins).to.deep.equal([plugin_path]);
    expect((config as LinterConfig).plugins_rules).to.not.be.null;
    expect((config as LinterConfig).plugins_rules?.["my-plugin/rule"]).to.have.property("name", "my-plugin/rule");
    expect((config as LinterConfig).plugins_rules?.["my-plugin/rule"].lint).to.be.a("function");
  });

  it("Throw an error when importing CJS plugin with .js extension", async function () {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.js");
    const config_path = path.join(__dirname, "fixtures", "config-invalid-cjs-plugin.mjs");
    try {
      await config_from_path(config_path);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-10");
      expect(error).to.have.property("meta");
      // @ts-expect-error Assertion before assert that meta exist
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(error.meta.module_name).to.eq(plugin_path);
    }
  });

  it("Throw an error when plugins rules property is not an array", async function () {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.cjs");
    rewiremock.overrideEntryPoint(module);
    rewiremock(plugin_path).with({
      rules: {}
    });
    rewiremock.enable();
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.cjs");
    try {
      await config_from_path(config_path);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-09");
      expect(error).to.have.deep.property("meta", {
        plugin_name: plugin_path
      });
    }
    rewiremock.disable();
  });

  it("Throw an error when rule does not have a name", async function () {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.cjs");
    rewiremock.overrideEntryPoint(module);
    rewiremock(plugin_path).with({
      rules: [{}]
    });
    rewiremock.enable();
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.cjs");
    try {
      await config_from_path(config_path);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-06");
      expect(error).to.have.deep.property("meta", {
        plugin_name: plugin_path
      });
    }
    rewiremock.disable();
  });

  it("Throw an error when rule's name is not prefixed", async function () {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.cjs");
    rewiremock.overrideEntryPoint(module);
    rewiremock(plugin_path).with({
      rules: [
        {
          name: "my-rule"
        }
      ]
    });
    rewiremock.enable();
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.cjs");
    try {
      await config_from_path(config_path);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-07");
      expect(error).to.have.deep.property("meta", {
        plugin_name: plugin_path,
        rule_name: "my-rule"
      });
    }
    rewiremock.disable();
  });

  it("Throw an error when rule does not have a lint function", async function () {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.cjs");
    rewiremock.overrideEntryPoint(module);
    rewiremock(plugin_path).with({
      rules: [
        {
          name: "my/my-rule"
        }
      ]
    });
    rewiremock.enable();
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.cjs");
    try {
      await config_from_path(config_path);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-08");
      expect(error).to.have.deep.property("meta", {
        rule_name: "my/my-rule"
      });
    }
    rewiremock.disable();
  });

  it("Throw an error when rule does not have a lint function", async function () {
    const config_path = path.join(__dirname, "fixtures", "invalid-config-plugin.cjs");
    try {
      await config_from_path(config_path);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-05");
      expect(error).to.have.deep.property("meta", {
        module_name: "foo"
      });
    }
  });
});
