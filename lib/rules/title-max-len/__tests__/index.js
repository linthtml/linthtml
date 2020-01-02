const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("title-max-len", function() {
  it("Should not report any error when the title does exceed max length", async function() {
    const linter = createLinter();
    const html = "<head><title>Title!</title></head>";

    const issues = await linter.lint(html, none, { "title-max-len": 60 });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error when the title length equal the max length", async function() {
    const linter = createLinter();
    const html = "<head><title>Title</title></head>";

    const issues = await linter.lint(html, none, { "title-max-len": 5 });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when the title does exceed the max length", async function() {
    const linter = createLinter();
    const html = "<head><title>Title!</title></head>";

    const issues = await linter.lint(html, none, { "title-max-len": 5 });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should throw an error if not given a number as config", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "title-max-len": "foo" }))
      .to
      .throw("Configuration for rule \"title-max-len\" is invalid: Expected number got string");
  });

  it("Should throw an error if not given a positive number as config", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "title-max-len": -1 }))
      .to
      .throw("Configuration for rule \"title-max-len\" is invalid: Only positive indent value are allowed.");
  });
});
