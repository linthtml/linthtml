const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("img-req-alt", function() {
  it("Should not report any error for <img> with an alt value", async function() {
    const linter = createLinter();
    const html = "<img src=\"cat.jpg\" alt=\"A cat picture\">";

    const issues = await linter.lint(html, none, { "img-req-alt": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for <img> without an alt value", async function() {
    const linter = createLinter();
    const html = "<img src=\"cat.jpg\">";

    const issues = await linter.lint(html, none, { "img-req-alt": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error for <img> with an empty alt value", async function() {
    const linter = createLinter();
    const html = "<img src=\"cat.jpg\" alt=\"\">";

    const issues = await linter.lint(html, none, { "img-req-alt": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should check only <img> ", async function() {
    const linter = createLinter();
    const html = "<div alt=\"\">";

    const issues = await linter.lint(html, none, { "img-req-alt": true });
    expect(issues).to.have.lengthOf(0);
  });

  describe("\"allownull\" option", function() {
    it("Should not report error for <img> with an empty alt value", async function() {
      const linter = createLinter();
      const html = "<img src=\"cat.jpg\" alt=\"\">";

      const issues = await linter.lint(html, none, { "img-req-alt": "allownull" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for <img> without an alt value", async function() {
      const linter = createLinter();
      const html = "<img src=\"cat.jpg\">";

      const issues = await linter.lint(html, none, { "img-req-alt": "allownull" });
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const linter = createLinter();
    const html = "<img src=\"cat.jpg\">";

    expect(() => linter.lint(html, none, { "img-req-alt": 0 }))
      .to
      .throw("Configuration for rule \"img-req-alt\" is invalid: Expected boolean got number");
  });

  it("Should throw an error for invalid config (not valid string)", function() {
    const linter = createLinter();
    const html = "<img src=\"cat.jpg\">";

    expect(() => linter.lint(html, none, { "img-req-alt": "foo" }))
      .to
      .throw("Configuration for rule \"img-req-alt\" is invalid: Only \"allownull\" is accepted as string value");
  });
});
