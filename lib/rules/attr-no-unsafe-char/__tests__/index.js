const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("attr-no-unsafe-char", function() {
  it("Should not report error for safe char in attributes", async function() {
    const linter = createLinter();
    const html = "<div class=\"\u0040\"></div>";

    const issues = await linter.lint(html, none, { "attr-no-unsafe-char": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report error for tabs/new_line in attributes", async function() {
    const linter = createLinter();
    const html = `
      <div class="
        foo
        bar">
      </div>`;

    const issues = await linter.lint(html, none, { "attr-no-unsafe-char": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report error for unsafe char in attributes", async function() {
    const linter = createLinter();
    const html = "<div class=\"\u070f\"></div>";

    const issues = await linter.lint(html, none, { "attr-no-unsafe-char": true });
    expect(issues).to.have.lengthOf(1);
  });
});

// \u0000 not accepted
