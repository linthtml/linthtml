const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | head-req-title", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report any error when the head title is present", async function() {
    const linter = createLinter({ "head-req-title": true });
    const html = `
    <html>
      <head>
        <title>Title!</title>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when the head title is not present", async function() {
    const linter = createLinter({ "head-req-title": true });
    const html = `
    <html>
      <head>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when the head title is empty", async function() {
    const linter = createLinter({ "head-req-title": true });
    const html = `
    <html>
      <head>
        <title></title>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  describe("Multiple <title>", function() {
    it("Should not report any error when one title is not empty", async function() {
      const linter = createLinter({ "head-req-title": true });
      const html = `
      <html>
        <head>
          <title></title>
          <title>Foo</title>
        </head>
      </html>
      `;

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report any errors when all titles are empty", async function() {
      const linter = createLinter({ "head-req-title": true });
      const html = `
      <html>
        <head>
          <title></title>
          <title></title>
        </head>
      </html>
      `;

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });
});
describe("legacy linter | head-req-title", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error when the head title is present", async function() {
    const linter = createLinter({ "head-req-title": true });
    const html = `
    <html>
      <head>
        <title>Title!</title>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when the head title is not present", async function() {
    const linter = createLinter({ "head-req-title": true });
    const html = `
    <html>
      <head>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when the head title is empty", async function() {
    const linter = createLinter({ "head-req-title": true });
    const html = `
    <html>
      <head>
        <title></title>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  describe("Multiple <title>", function() {
    it("Should not report any error when one title is not empty", async function() {
      const linter = createLinter({ "head-req-title": true });
      const html = `
      <html>
        <head>
          <title></title>
          <title>Foo</title>
        </head>
      </html>
      `;

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report any errors when all titles are empty", async function() {
      const linter = createLinter({ "head-req-title": true });
      const html = `
      <html>
        <head>
          <title></title>
          <title></title>
        </head>
      </html>
      `;

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });
});
