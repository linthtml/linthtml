const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("input-radio-req-name", function() {
  it("Should not report any error for radio input with a name", async function() {
    const linter = createLinter();
    const html = "<input type=\"radio\" name=\"foo\">";

    const issues = await linter.lint(html, none, { "input-radio-req-name": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for radio input without a name", async function() {
    const linter = createLinter();
    const html = "<input type=\"radio\">";

    const issues = await linter.lint(html, none, { "input-radio-req-name": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error for radio input with an empty name value", async function() {
    const linter = createLinter();
    const html = "<input type=\"radio\" name=\"\">";

    const issues = await linter.lint(html, none, { "input-radio-req-name": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error if input with no type", async function() {
    const linter = createLinter();
    const html = "<input>";

    const issues = await linter.lint(html, none, { "input-radio-req-name": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error if input is not a radio input", async function() {
    const linter = createLinter();
    const html = "<input type=\"text\">";

    const issues = await linter.lint(html, none, { "input-radio-req-name": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should check only input radio ", async function() {
    const linter = createLinter();
    const html = "<div name=\"\">";

    const issues = await linter.lint(html, none, { "input-radio-req-name": true });
    expect(issues).to.have.lengthOf(0);
  });
});
