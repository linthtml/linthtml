const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | table-req-header", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should report an error when \"<table>\" does not have a \"<thead>\"", async function() {
    const linter = createLinter({ "table-req-header": true });
    const html = "<table></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error for \"<table>\" with a \"<th>\"", async function() {
    const linter = createLinter({ "table-req-header": true });
    const html = "<table><tr><th>Header></th></tr></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for \"<table>\" with a \"<th>\" (not first child)", async function() {
    const linter = createLinter({ "table-req-header": true });
    const html = "<table><tr><td>Data</td><th>Header></th></tr></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for \"<table>\" with a \"<thead>\"", async function() {
    const linter = createLinter({ "table-req-header": true });
    const html = "<table><thead>Header></thead></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for \"<table>\" with a \"<thead>\" and text content before", async function() {
    const linter = createLinter({ "table-req-header": true });
    const html = "<table>text<thead>Header></thead></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when \"<th>\" not child of \"<tr>\"", async function() {
    const linter = createLinter({ "table-req-header": true });
    const html = "<table><th>Header></th></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when no \"<th>\" in first \"<tr>\"", async function() {
    const linter = createLinter({ "table-req-header": true });
    const html = "<table><tr><td>Data</td></tr><tr><th>Header</th></tr></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
});
describe("table-req-header", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error when \"<table>\" does not have a \"<thead>\"", async function() {
    const linter = createLinter({ "table-req-header": true });
    const html = "<table></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error for \"<table>\" with a \"<th>\"", async function() {
    const linter = createLinter({ "table-req-header": true });
    const html = "<table><tr><th>Header></th></tr></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for \"<table>\" with a \"<th>\" (not first child)", async function() {
    const linter = createLinter({ "table-req-header": true });
    const html = "<table><tr><td>Data</td><th>Header></th></tr></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for \"<table>\" with a \"<thead>\"", async function() {
    const linter = createLinter({ "table-req-header": true });
    const html = "<table><thead>Header></thead></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for \"<table>\" with a \"<thead>\" and text content before", async function() {
    const linter = createLinter({ "table-req-header": true });
    const html = "<table>text<thead>Header></thead></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when \"<th>\" not child of \"<tr>\"", async function() {
    const linter = createLinter({ "table-req-header": true });
    const html = "<table><th>Header></th></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when no \"<th>\" in first \"<tr>\"", async function() {
    const linter = createLinter({ "table-req-header": true });
    const html = "<table><tr><td>Data</td></tr><tr><th>Header</th></tr></table>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
});
