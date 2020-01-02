const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("head-req-title", function() {
  it("Should not report any error when the head title is present", async function() {
    const linter = createLinter();
    const html = `
    <html>
      <head>
        <title>Title!</title>
      </head>
    </html>
    `;

    const issues = await linter.lint(html, none, { "head-req-title": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when the head title is not present", async function() {
    const linter = createLinter();
    const html = `
    <html>
      <head>
      </head>
    </html>
    `;

    const issues = await linter.lint(html, none, { "head-req-title": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when the head title is empty", async function() {
    const linter = createLinter();
    const html = `
    <html>
      <head>
        <title></title>
      </head>
    </html>
    `;

    const issues = await linter.lint(html, none, { "head-req-title": true });
    expect(issues).to.have.lengthOf(1);
  });

  describe("Multiple <title>", function() {
    it("Should not report any error when one title is not empty", async function() {
      const linter = createLinter();
      const html = `
      <html>
        <head>
          <title></title>
          <title>Foo</title>
        </head>
      </html>
      `;

      const issues = await linter.lint(html, none, { "head-req-title": true });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report any errors when all titles are empty", async function() {
      const linter = createLinter();
      const html = `
      <html>
        <head>
          <title></title>
          <title></title>
        </head>
      </html>
      `;

      const issues = await linter.lint(html, none, { "head-req-title": true });
      expect(issues).to.have.lengthOf(1);
    });
  });
});
