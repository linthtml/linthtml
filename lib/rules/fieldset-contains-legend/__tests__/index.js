const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("fieldset-contains-legend", function() {
  it("Should not report an error when a fieldset contains a legend tag", async function() {
    const linter = createLinter();
    const html = "<fieldset><legend>Foo</legend></fieldset>";

    const issues = await linter.lint(html, none, { "fieldset-contains-legend": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when a fieldset does not contains a legend tag", async function() {
    const linter = createLinter();
    const html = "<fieldset><div></div></fieldset>";

    const issues = await linter.lint(html, none, { "fieldset-contains-legend": true });
    expect(issues).to.have.lengthOf(1);
  });
});
