const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("table-req-caption", function() {
  it("Should report an error when \"<table>\" does not have a \"<caption>\"", async function() {
    const linter = createLinter();
    const html = "<table></table>";

    const issues = await linter.lint(html, none, { "table-req-caption": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when \"<caption>\" is not a child of \"<table>\"", async function() {
    const linter = createLinter();
    const html = "<table><td><caption>Hello</caption></td></table>";

    const issues = await linter.lint(html, none, { "table-req-caption": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when \"<caption>\" is a sibling of \"<table>\"", async function() {
    const linter = createLinter();
    const html = "<table></table><caption>Hello</caption>";

    const issues = await linter.lint(html, none, { "table-req-caption": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report as many error as \"<table>\" without \"<caption>\"", async function() {
    const linter = createLinter();
    const html = "<table></table><table></table>";

    const issues = await linter.lint(html, none, { "table-req-caption": true });
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not report any error for \"<table>\" with \"<caption>\"", async function() {
    const linter = createLinter();
    const html = "<table><caption>Caption></table><table><td></td><td></td><caption>Caption</caption></table>";

    const issues = await linter.lint(html, none, { "table-req-caption": true });
    expect(issues).to.have.lengthOf(0);
  });
});
