const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | input-radio-req-name", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report any error for radio input with a name", async function() {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = "<input type=\"radio\" name=\"foo\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for radio input without a name", async function() {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = "<input type=\"radio\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error for radio input with an empty name value", async function() {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = "<input type=\"radio\" name=\"\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error if input with no type", async function() {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = "<input>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error if input is not a radio input", async function() {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = "<input type=\"text\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should check only input radio ", async function() {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = "<div name=\"\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
describe("legacy linter | input-radio-req-name", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error for radio input with a name", async function() {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = "<input type=\"radio\" name=\"foo\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for radio input without a name", async function() {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = "<input type=\"radio\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error for radio input with an empty name value", async function() {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = "<input type=\"radio\" name=\"\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error if input with no type", async function() {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = "<input>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error if input is not a radio input", async function() {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = "<input type=\"text\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should check only input radio ", async function() {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = "<div name=\"\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
