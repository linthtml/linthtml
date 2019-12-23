const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("attr-quote-style", function() {
  it("Should report an error for unquoted attribute", async function() {
    const linter = createLinter();
    const html = "<div class=foo></div>";

    const issues = await linter.lint(html, none, { "attr-quote-style": "quoted" });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error for quoted attribute", async function() {
    const linter = createLinter();
    const html = "<div class=\"foo\"></div>";

    const issues = await linter.lint(html, none, { "attr-quote-style": "quoted" });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when invalid quote style is used (single quoted attr in double mode)", async function() {
    const linter = createLinter();
    const html = "<div class='foo'></div>";

    const issues = await linter.lint(html, none, { "attr-quote-style": "double" });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when invalid quote style is used (double quoted attr in single mode)", async function() {
    const linter = createLinter();
    const html = "<div class=\"foo\"></div>";

    const issues = await linter.lint(html, none, { "attr-quote-style": "single" });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should ignore attributes with no values", async function() {
    const linter = createLinter();
    const html = "<button disabled>Button</button>";

    const issues = await linter.lint(html, none, { "attr-quote-style": "single" });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error when an invalid config is provided (invalid string)", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "attr-quote-style": "unknown" }))
      .to
      .throw("Configuration for rule \"attr-quote-style\" is invalid: Expected \"double\", \"simple\" or \"quoted\" got \"unknown\".");
  });

  it("Should throw an error when an invalid config is provided (invalid type)", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "attr-quote-style": 3 }))
      .to
      .throw("Configuration for rule \"attr-quote-style\" is invalid: Expected \"double\", \"simple\" or \"quoted\" got number.");
  });
});
