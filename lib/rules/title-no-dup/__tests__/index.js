const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;
function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}

describe("title-no-dup", function() {
  it("Should not report an error when title is not duplicated", async function() {
    const linter = createLinter();
    const html = "<head><title>Title!</title></head>";

    const issues = await linter.lint(html, none, { "title-no-dup": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when title is duplicated", async function() {
    const linter = createLinter();
    const html = "<head><title>Title!</title><title>Title!</title></head>";

    const issues = await linter.lint(html, none, { "title-no-dup": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should catch multiple duplicates", async function() {
    const linter = createLinter();
    const html = "<head><title>Title!</title><title>Title!</title><title>Title!</title><title>Title!</title></head>";

    const issues = await linter.lint(html, none, { "title-no-dup": true });
    expect(issues).to.have.lengthOf(3);
  });
});
