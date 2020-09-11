const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | table-req-caption", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should report an error when \"<table>\" does not have a \"<caption>\"", async function() {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when \"<caption>\" is not a child of \"<table>\"", async function() {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table><td><caption>Hello</caption></td></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when \"<caption>\" is a sibling of \"<table>\"", async function() {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table></table><caption>Hello</caption>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report as many error as \"<table>\" without \"<caption>\"", async function() {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table></table><table></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not report any error for \"<table>\" with \"<caption>\"", async function() {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table><caption>Caption></table><table><td></td><td></td><caption>Caption</caption></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});

describe("table-req-caption", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error when \"<table>\" does not have a \"<caption>\"", async function() {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when \"<caption>\" is not a child of \"<table>\"", async function() {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table><td><caption>Hello</caption></td></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when \"<caption>\" is a sibling of \"<table>\"", async function() {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table></table><caption>Hello</caption>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report as many error as \"<table>\" without \"<caption>\"", async function() {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table></table><table></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not report any error for \"<table>\" with \"<caption>\"", async function() {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table><caption>Caption></table><table><td></td><td></td><caption>Caption</caption></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
