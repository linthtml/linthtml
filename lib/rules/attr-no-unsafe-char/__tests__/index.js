const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | attr-no-unsafe-char", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report error for safe char in attributes", async function() {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = "<div class=\"\u0040\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report error for tabs/new_line in attributes", async function() {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = `
      <div class="
        foo
        bar">
      </div>`;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report error for unsafe char in attributes", async function() {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = "<div class=\"\u070f\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report error for attribute without value", async function() {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = "<input aria-label='foo' required/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});

describe("attr-no-unsafe-char", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report error for safe char in attributes", async function() {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = "<div class=\"\u0040\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report error for tabs/new_line in attributes", async function() {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = `
      <div class="
        foo
        bar">
      </div>`;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report error for unsafe char in attributes", async function() {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = "<div class=\"\u070f\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report error for attribute without value", async function() {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = "<input aria-label='foo' required/>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
// \u0000 not accepted
