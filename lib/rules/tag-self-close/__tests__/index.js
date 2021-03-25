const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | tag-self-close", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }

  it("Should report an error for not closed self closed tags when \"tag-self-close\" is set to \"always\"", async function() {
    const linter = createLinter({ "tag-self-close": "always" });
    const html = "<img>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error for closed self closed tags when \"tag-self-close\" is set to \"always\"", async function() {
    const linter = createLinter({ "tag-self-close": "always" });
    const html = "<img/>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for closed self closed tags when \"tag-self-close\" is set to \"never\"", async function() {
    const linter = createLinter({ "tag-self-close": "never" });
    const html = "<img>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error for not closed self closed tags when \"tag-self-close\" is set to \"never\"", async function() {
    const linter = createLinter({ "tag-self-close": "never" });
    const html = "<img/>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should throw an error for an invalid config", function() {
    const linter = createLinter({ "tag-self-close": true });
    const html = "<button\"></button>";
    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"tag-self-close\" is invalid: Expected string got boolean");
  });

  it("Should throw an error if not given a list of strings as config", function() {
    const linter = createLinter({ "tag-self-close": "foo" });
    const html = "<button></button>";
    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"tag-self-close\" is invalid: \"foo\" is not accepted. Accepted values are \"always\" and \"never\".");
  });
});

describe("tag-self-close", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }

  it("Should report an error for not closed self closed tags when \"tag-self-close\" is set to \"always\"", async function() {
    const linter = createLinter({
      "tag-self-close": [
        true,
        "always"
      ]
    });
    const html = "<img>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error for closed self closed tags when \"tag-self-close\" is set to \"always\"", async function() {
    const linter = createLinter({
      "tag-self-close": [
        true,
        "always"
      ]
    });
    const html = "<img/>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for closed self closed tags when \"tag-self-close\" is set to \"never\"", async function() {
    const linter = createLinter({
      "tag-self-close": [
        true,
        "never"
      ]
    });
    const html = "<img>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error for not closed self closed tags when \"tag-self-close\" is set to \"never\"", async function() {
    const linter = createLinter({
      "tag-self-close": [
        true,
        "never"
      ]
    });
    const html = "<img/>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should throw an error for an invalid config", function() {
    const config = {
      "tag-self-close": [
        true,
        true
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"tag-self-close\" is invalid: Expected string got boolean");
  });

  it("Should throw an error if not given a list of strings as config", function() {
    const config = {
      "tag-self-close": [
        true,
        "foo"
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"tag-self-close\" is invalid: \"foo\" is not accepted. Accepted values are \"always\" and \"never\".");
  });
});
