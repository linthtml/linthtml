const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("line-end-style", function() {
  describe("\"cr\" mode", function() {
    it("Should not report any errors for valide end line", async function() {
      const linter = createLinter();
      const html = [
        "<body>\r",
        "  <p>\r",
        "    some text\r",
        "  </p>\r",
        "</body>\r"
      ].join("");

      const issues = await linter.lint(html, none, { "line-end-style": "cr" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report errors for invalide end line", async function() {
      const linter = createLinter();
      const html = [
        "<body>\n",
        "  <p>\r",
        "    some text\r",
        "  </p>\r",
        "</body>\r"
      ].join("");
      const issues = await linter.lint(html, none, { "line-end-style": "cr" });
      expect(issues).to.have.lengthOf(1);
    });
  });
  describe("\"lf\" mode", function() {
    it("Should report errors for invalide end line", async function() {
      const linter = createLinter();
      const html = [
        "<body>\n",
        "  <p>\n",
        "    some text\n",
        "  </p>\n",
        "</body>\n"
      ].join("");

      const issues = await linter.lint(html, none, { "line-end-style": "lf" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for valide end line", async function() {
      const linter = createLinter();
      const html = [
        "<body>\n",
        "  <p>\r",
        "    some text\r",
        "  </p>\r",
        "</body>\r"
      ].join("");

      const issues = await linter.lint(html, none, { "line-end-style": "lf" });
      expect(issues).to.have.lengthOf(4);
    });
  });
  describe("\"crlf\" mode", function() {
    it("Should report errors for invalide end line", async function() {
      const linter = createLinter();
      const html = [
        "<body>\r\n",
        "  <p>\r\n",
        "    some text\r\n",
        "  </p>\r\n",
        "</body>\r\n"
      ].join("");

      const issues = await linter.lint(html, none, { "line-end-style": "crlf" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for valide end line", async function() {
      const linter = createLinter();
      const html = [
        "<body>\r\n",
        "  <p>\r\n",
        "    some text\r",
        "  </p>\r\n",
        "</body>\r\n"
      ].join("");

      const issues = await linter.lint(html, none, { "line-end-style": "crlf" });
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should not report any error for just one line without end char", async function() {
    const linter = createLinter();
    const html = "<p>foo</p>";

    const issues = await linter.lint(html, none, { "line-end-style": "lf" });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error for invalid config (not valid type)", function() {
    const linter = createLinter();
    const html = "";

    expect(() => linter.lint(html, none, { "line-end-style": 0 }))
      .to
      .throw("Configuration for rule \"line-end-style\" is invalid: Expected a string got number.");
  });

  it("Should throw an error for invalid config (not valid string)", function() {
    const linter = createLinter();
    const html = "";

    expect(() => linter.lint(html, none, { "line-end-style": "foo" }))
      .to
      .throw("Configuration for rule \"line-end-style\" is invalid: Expected \"cr\", \"lf\" or \"crlf\" got \"foo\".");
  });
});
