const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | attr-bans", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report an error for a tag named 'style'", async function() {
    const linter = createLinter({ "attr-bans": ["style"] });
    const html = "<body><style>hello</style></body>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report anything when disabled", async function() {
    const linter = createLinter({ "attr-bans": false });
    const html = "<button style=\"color: red;\"></button>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should accept a single string as option", async function() {
    const linter = createLinter({ "attr-bans": "style" });
    const html = "<button style=\"color: red;\"></button>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Banned attributes should be case insensitive", async function() {
    const linter = createLinter({ "attr-bans": ["ban0", "bAN1"] });
    const html = "<body ban0 ban1>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should accept regexes as config", async function() {
    const linter = createLinter({ "attr-bans": [/on\w+/i] });
    const html = "<div onClick='' onfocus='' noop=''></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should throw an error for an invalid config", async function() {
    const linter = createLinter({ "attr-bans": true });
    const html = "<button style=\"color: red;\"></button>";
    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"attr-bans\" is invalid: Expected string, RegExp or (string|RegExp)[] got boolean");
  });

  it("Should throw an error if not given a list of strings as config", function() {
    const linter = createLinter({ "attr-bans": ["string", true] });
    const html = "<button style=\"color: red;\"></button>";
    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"attr-bans\" is invalid: Expected string, RegExp or (string|RegExp)[] got boolean[]");
  });

  it("Should report an error when the 'style' attribute is present", async function() {
    const linter = createLinter({ "attr-bans": ["style"] });
    const html = "<button style=\"color: red;\"></button>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
});
describe("attr-bans", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }

  it("Should not report an error for a tag named 'style'", async function() {
    const linter = createLinter({ "attr-bans": [true, "style"] });
    const html = "<body><style>hello</style></body>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report anything when disabled", async function() {
    const linter = createLinter({
      "attr-bans": false
    });
    const html = "<button style=\"color: red;\"></button>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should accept a single string as option", async function() {
    const linter = createLinter({
      "attr-bans": [
        true,
        "style"
      ]
    });
    const html = "<button style=\"color: red;\"></button>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Banned attributes should be case insensitive", async function() {
    const linter = createLinter({
      "attr-bans": [
        true,
        ["ban0", "bAN1"]
      ]
    });
    const html = "<body ban0 ban1>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should accept regexes as config", async function() {
    const linter = createLinter({
      "attr-bans": [
        true,
        [/on\w+/i]
      ]
    });
    const html = "<div onClick='' onfocus='' noop=''></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should throw an error for an invalid config", async function() {
    const config = {
      "attr-bans": [
        true,
        true
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"attr-bans\" is invalid: Expected string, RegExp or (string|RegExp)[] got boolean");
  });

  it("Should throw an error if not given a list of strings as config", function() {
    const config = {
      "attr-bans": [
        true,
        ["string", true]
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"attr-bans\" is invalid: Expected string, RegExp or (string|RegExp)[] got boolean[]");
  });

  it("Should report an error when the 'style' attribute is present", async function() {
    const linter = createLinter({
      "attr-bans": [
        true,
        "style"
      ]
    });
    const html = "<button style=\"color: red;\"></button>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
});
