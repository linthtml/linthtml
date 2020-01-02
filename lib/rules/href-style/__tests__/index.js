const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("href-style", function() {
  describe("\"absolute\" mode", function() {
    it("Should not report any error for absolute links", async function() {
      const linter = createLinter();
      const html = "<a href=\"http://www.google.com\">A link</a>";

      const issues = await linter.lint(html, none, { "href-style": "absolute" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for relative links", async function() {
      const linter = createLinter();
      const html = "<a href=\"/foo\">A link</a>";

      const issues = await linter.lint(html, none, { "href-style": "absolute" });
      expect(issues).to.have.lengthOf(1);
    });

    it("Should not report any error for empty links", async function() {
      const linter = createLinter();
      const html = "<a>A link</a>";

      const issues = await linter.lint(html, none, { "href-style": "absolute" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for fragment only links", async function() {
      const linter = createLinter();
      const html = "<a href=\"#bar\">A link</a>";

      const issues = await linter.lint(html, none, { "href-style": "absolute" });
      expect(issues).to.have.lengthOf(0);
    });
  });
  describe("\"relative\" mode", function() {
    it("Should not report any error for relative links", async function() {
      const linter = createLinter();
      const html = "<a href=\"/foo\">A link</a>";

      const issues = await linter.lint(html, none, { "href-style": "relative" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for absolute links", async function() {
      const linter = createLinter();
      const html = "<a href=\"http://www.google.com\">A link</a>";

      const issues = await linter.lint(html, none, { "href-style": "relative" });
      expect(issues).to.have.lengthOf(1);
    });

    it("Should not report any error for empty links", async function() {
      const linter = createLinter();
      const html = "<a>A link</a>";

      const issues = await linter.lint(html, none, { "href-style": "relative" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for fragment only links", async function() {
      const linter = createLinter();
      const html = "<a href=\"#bar\">A link</a>";

      const issues = await linter.lint(html, none, { "href-style": "relative" });
      expect(issues).to.have.lengthOf(0);
    });
  });

  it("Should throw an error for an invalid config", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "href-style": true }))
      .to
      .throw("Configuration for rule \"href-style\" is invalid: Expected string got boolean");
  });

  it("Should throw an error if not given a list of strings as config", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "href-style": "foo" }))
      .to
      .throw("Configuration for rule \"href-style\" is invalid: \"foo\" is not accepted. Accepted values are \"absolute\" and \"relative\".");
  });
});
