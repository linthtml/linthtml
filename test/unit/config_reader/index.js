const { expect } = require("chai");
const {
  config_from_path,
  find_local_config
} = require("../../../lib/read-config");
const path = require("path");

describe("Get config from path", function() {
  it("Report an error if path provided does not exist", function() {
    try {
      config_from_path("unknow_file");
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error)
        .to
        .have
        .property("code", "CORE-02");
      expect(error)
        .to
        .have
        .deep
        .property("meta", {
          config_path: path.join(process.cwd(), "unknow_file")
        });
    }
  });

  it("Report an error when there's no config file in the folder provided", function() {
    let assertions_runned = false;
    try {
      config_from_path(__dirname);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error)
        .to
        .have
        .property("code", "CORE-01");
      expect(error)
        .to
        .have
        .deep
        .property("meta", {
          config_path: __dirname
        });
      assertions_runned = true;
    }

    expect(assertions_runned).to.be.true;
  });

  it("Return the config object from cosmiconfig if config file exist", function() {
    const config_path = path.join(__dirname, "fixtures", ".linthtmlrc.js");
    const config = config_from_path(config_path);
    expect(config)
      .to
      .have
      .property("config");
    expect(config)
      .to
      .have
      .property("filepath", config_path);
  });

  it("Return the config object from cosmiconfig if there's a config file in the folder provided", function() {
    const config_path = path.join(__dirname, "fixtures");
    const config = config_from_path(config_path);
    expect(config)
      .to
      .have
      .property("config");
    expect(config)
      .to
      .have
      .property("filepath", path.join(config_path, ".linthtmlrc.js"));
  });
});

// Start by searching in the file folder, then search in the parent folder and the parent folder (...) until it reach the root directory
describe("Find config file for a file path", function() {
  it("Return not nothing if it cannot find a config file", function() {
    const config = find_local_config(__dirname);
    expect(config).to.be.null;
  });

  it("Return the config object from cosmiconfig if there's a config file in the file folder", function() {
    const config_path = path.join(__dirname, "fixtures");
    const config = find_local_config(config_path);
    expect(config)
      .to
      .have
      .property("config");
    expect(config)
      .to
      .have
      .property("filepath", path.join(config_path, ".linthtmlrc.js"));
  });

  it("Return the config object from cosmiconfig if there's a config file in parent folder", function() {
    const config_path = path.join(__dirname, "fixtures", "pages");
    const config = find_local_config(config_path);
    expect(config)
      .to
      .have
      .property("config");
    expect(config)
      .to
      .have
      .property("filepath", path.join(__dirname, "fixtures", ".linthtmlrc.js"));
  });
});

describe("Load extends config", function() {
  it("Load and merge configs", function() {
    const config_path = path.join(__dirname, "fixtures", "valid-extends.js");
    const { config } = config_from_path(config_path);
    expect(config)
      .to
      .deep
      .equal({
        extends: [
          "./config-attr-bans"
        ],
        rules: {
          "attr-bans": true
        }
      });
  });

  it("Throw an error extended config does not exist", function() {
    const config_path = path.join(__dirname, "fixtures", "valid-extends.js");

    try {
      config_from_path(config_path);
    } catch (error) {
      expect(error).to.be.a("CustomError");
      expect(error)
        .to
        .have
        .property("code", "CORE-03");
      expect(error)
        .to
        .have
        .deep
        .property("meta", {
          module_name: "./foo"
        });
    }
  });

  it("'extends' accept a string only", function() {
    const config_path = path.join(__dirname, "fixtures", "valid-extends-string-only.js");
    const { config } = config_from_path(config_path);
    expect(config)
      .to
      .deep
      .equal({
        extends: "./config-attr-bans",
        rules: {
          "attr-bans": true
        }
      });
  });

  it("Rules settings from config file and extends are merged", function() {
    const config_path = path.join(__dirname, "fixtures", "extends-merged-rules-settings.js");
    const { config } = config_from_path(config_path);
    expect(config)
      .to
      .deep
      .equal({
        extends: [
          "./config-attr-bans",
          "./config-tag-bans"
        ],
        rules: {
          "attr-bans": true,
          "indent-style": [
            true,
            "spaces"
          ],
          "tag-bans": [
            true,
            "style",
            "b",
            "i"
          ]
        }
      });
  });

  it("Rule settings from config file overrides rule settings form extends", function() {
    const config_path = path.join(__dirname, "fixtures", "extends-with-overrides.js");
    const { config } = config_from_path(config_path);
    expect(config)
      .to
      .deep
      .equal({
        extends: [
          "./config-attr-bans",
          "./config-tag-bans"
        ],
        rules: {
          "attr-bans": "off",
          "tag-bans": [
            true,
            "style",
            "b",
            "i"
          ]
        }
      });
  });

  // Add function to load_extends from given config object (not only paths)?
});
