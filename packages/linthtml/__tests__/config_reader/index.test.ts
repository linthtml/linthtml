import { expect } from "chai";
import rewiremock from "rewiremock/node";
import path from "path";
import { config_from_path, find_local_config } from "../../lib/read-config";

describe("Get config from path", function () {
  it("Report an error if path provided does not exist", function () {
    try {
      config_from_path("unknow_file");
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-02");
      expect(error).to.have.deep.property("meta", {
        config_path: path.join(process.cwd(), "unknow_file")
      });
    }
  });

  it("Report an error when there's no config file in the folder provided", function () {
    let assertions_runned = false;
    try {
      config_from_path(__dirname);
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

  it("Return the config object from cosmiconfig if config file exist", function () {
    const config_path = path.join(__dirname, "fixtures", ".linthtmlrc.js");
    const config = config_from_path(config_path);
    expect(config).to.have.property("config");
    expect(config).to.have.property("filepath", config_path);
  });

  it("Return the config object from cosmiconfig if there's a config file in the folder provided", function () {
    const config_path = path.join(__dirname, "fixtures");
    const config = config_from_path(config_path);
    expect(config).to.have.property("config");
    expect(config).to.have.property("filepath", path.join(config_path, ".linthtmlrc.js"));
  });
});

// Start by searching in the file folder, then search in the parent folder and the parent folder (...) until it reach the root directory
describe("Find config file for a file path", function () {
  it("Return not nothing if it cannot find a config file", function () {
    const config = find_local_config(__dirname);
    expect(config).to.be.null;
  });

  it("Return the config object from cosmiconfig if there's a config file in the file folder", function () {
    const config_path = path.join(__dirname, "fixtures");
    const config = find_local_config(config_path);
    expect(config).to.have.property("config");
    expect(config).to.have.property("filepath", path.join(config_path, ".linthtmlrc.js"));
  });

  it("Return the config object from cosmiconfig if there's a config file in parent folder", function () {
    const config_path = path.join(__dirname, "fixtures", "pages");
    const config = find_local_config(config_path);
    expect(config).to.have.property("config");
    expect(config).to.have.property("filepath", path.join(__dirname, "fixtures", ".linthtmlrc.js"));
  });
});

describe("Load extends config", function () {
  it("Load and merge configs", function () {
    const config_path = path.join(__dirname, "fixtures", "valid-extends.js");
    const { config } = config_from_path(config_path);
    expect(config).to.deep.equal({
      extends: ["./config-attr-bans"],
      plugins: [],
      plugins_rules: {},
      ignoreFiles: [],
      rules: {
        "attr-bans": true
      }
    });
  });

  it("Throw an error extended config does not exist", function () {
    const config_path = path.join(__dirname, "fixtures", "valid-extends.js");

    try {
      config_from_path(config_path);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-03");
      expect(error).to.have.deep.property("meta", {
        module_name: "./foo"
      });
    }
  });

  it("'extends' accept a string only", function () {
    const config_path = path.join(__dirname, "fixtures", "valid-extends-string-only.js");
    const { config } = config_from_path(config_path);
    expect(config).to.deep.equal({
      extends: "./config-attr-bans",
      plugins: [],
      plugins_rules: {},
      ignoreFiles: [],
      rules: {
        "attr-bans": true
      }
    });
  });

  it("Rules settings from config file and extends are merged", function () {
    const config_path = path.join(__dirname, "fixtures", "extends-merged-rules-settings.js");
    const { config } = config_from_path(config_path);
    expect(config).to.deep.equal({
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

  it("Rule settings from config file overrides rule settings form extends", function () {
    const config_path = path.join(__dirname, "fixtures", "extends-with-overrides.js");
    const { config } = config_from_path(config_path);
    expect(config).to.deep.equal({
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

describe("Load plugins", function () {
  it("Load and merge rules from plugins", function () {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.js");
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.js");
    const { config } = config_from_path(config_path);
    expect(config.plugins).to.deep.equal([plugin_path]);
    expect(config.plugins_rules).to.not.be.null;
    expect((config.plugins_rules as any)["my-plugin/rule"]).to.have.property("name", "my-plugin/rule");
    expect((config.plugins_rules as any)["my-plugin/rule"].lint).to.be.a("function");
  });
  it("Throw an error when plugins rules property is not an array", function () {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.js");
    rewiremock.overrideEntryPoint(module);
    rewiremock(plugin_path).with({
      rules: {}
    });
    rewiremock.enable();
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.js");
    try {
      config_from_path(config_path);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-09");
      expect(error).to.have.deep.property("meta", {
        plugin_name: plugin_path
      });
    }
    rewiremock.disable();
  });
  it("Throw an error when rule does not have a name", function () {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.js");
    rewiremock.overrideEntryPoint(module);
    rewiremock(plugin_path).with({
      rules: [{}]
    });
    rewiremock.enable();
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.js");
    try {
      config_from_path(config_path);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-06");
      expect(error).to.have.deep.property("meta", {
        plugin_name: plugin_path
      });
    }
    rewiremock.disable();
  });
  it("Throw an error when rule's name is not prefixed", function () {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.js");
    rewiremock.overrideEntryPoint(module);
    rewiremock(plugin_path).with({
      rules: [
        {
          name: "my-rule"
        }
      ]
    });
    rewiremock.enable();
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.js");
    try {
      config_from_path(config_path);
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
  it("Throw an error when rule does not have a lint function", function () {
    const plugin_path = path.join(__dirname, "fixtures", "plugin.js");
    rewiremock.overrideEntryPoint(module);
    rewiremock(plugin_path).with({
      rules: [
        {
          name: "my/my-rule"
        }
      ]
    });
    rewiremock.enable();
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.js");
    try {
      config_from_path(config_path);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-08");
      expect(error).to.have.deep.property("meta", {
        rule_name: "my/my-rule"
      });
    }
    rewiremock.disable();
  });
  it("Throw an error when rule does not have a lint function", function () {
    const config_path = path.join(__dirname, "fixtures", "invalid-config-plugin.js");
    try {
      config_from_path(config_path);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error).to.have.property("code", "CORE-05");
      expect(error).to.have.deep.property("meta", {
        module_name: "foo"
      });
    }
  });
});
