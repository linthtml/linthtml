const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | fieldset-contains-legend", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report an error when a fieldset contains a legend tag", async function() {
    const linter = createLinter({ "fieldset-contains-legend": true });
    const html = "<fieldset><legend>Foo</legend></fieldset>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when a fieldset does not contains a legend tag", async function() {
    const linter = createLinter({ "fieldset-contains-legend": true });
    const html = "<fieldset><div></div></fieldset>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
});
describe("fieldset-contains-legend", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report an error when a fieldset contains a legend tag", async function() {
    const linter = createLinter({ "fieldset-contains-legend": true });
    const html = "<fieldset><legend>Foo</legend></fieldset>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when a fieldset does not contains a legend tag", async function() {
    const linter = createLinter({ "fieldset-contains-legend": true });
    const html = "<fieldset><div></div></fieldset>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
});
