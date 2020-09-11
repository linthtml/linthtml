const { expect } = require("chai");
const { config_from_path, find_local_config } = require("../../../lib/read-config");
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
        .property("code", "CLI-02");
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
        .property("code", "CLI-01");
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
