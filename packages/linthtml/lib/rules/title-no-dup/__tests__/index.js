const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | title-no-dup", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report an error when title is not duplicated", async function() {
    const linter = createLinter({ "title-no-dup": true });
    const html = "<head><title>Title!</title></head>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when title is duplicated", async function() {
    const linter = createLinter({ "title-no-dup": true });
    const html = "<head><title>Title!</title><title>Title!</title></head>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should catch multiple duplicates", async function() {
    const linter = createLinter({ "title-no-dup": true });
    const html = "<head><title>Title!</title><title>Title!</title><title>Title!</title><title>Title!</title></head>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(3);
  });
});

describe("title-no-dup", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report an error when title is not duplicated", async function() {
    const linter = createLinter({ "title-no-dup": true });
    const html = "<head><title>Title!</title></head>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when title is duplicated", async function() {
    const linter = createLinter({ "title-no-dup": true });
    const html = "<head><title>Title!</title><title>Title!</title></head>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should catch multiple duplicates", async function() {
    const linter = createLinter({ "title-no-dup": true });
    const html = "<head><title>Title!</title><title>Title!</title><title>Title!</title><title>Title!</title></head>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(3);
  });
});
