const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("html-valid-content-model", function() {
  it("Should report an error for every invalid child", async function() {
    const linter = createLinter();
    const html = `
      <html>
        <head></head>
        <div>A div</div>
        <p>A paragraph</p>
        <button>A button</button>
      </html>
    `;

    const issues = await linter.lint(html, none, { "html-valid-content-model": true });
    expect(issues).to.have.lengthOf(3);
  });

  it("Should not report any error when <html> is missing", async function() {
    const linter = createLinter();
    const html = `
      <head></head>
      <div>A div</div>
      <p>A paragraph</p>
      <button>A button</button>
      <body></body>
    `;

    const issues = await linter.lint(html, none, { "html-valid-content-model": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error when <head> and <body> are in the correct order", async function() {
    const linter = createLinter();
    const html = `
      <html>
        <head></head>
        <body></body>
      </html>
    `;

    const issues = await linter.lint(html, none, { "html-valid-content-model": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when <head> and <body> are not in the correct order", async function() {
    const linter = createLinter();
    const html = `
      <html>
        <body></body>
        <head></head>
      </html>
    `;

    const issues = await linter.lint(html, none, { "html-valid-content-model": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should accept only one <head> as child", async function() {
    const linter = createLinter();
    const html = `
      <html>
        <head></head>
        <head></head>
        <head></head>
      </html>
    `;

    const issues = await linter.lint(html, none, { "html-valid-content-model": true });
    expect(issues).to.have.lengthOf(2);
  });

  it("Should accept only one <body> as child", async function() {
    const linter = createLinter();
    const html = `
      <html>
        <body></body>
        <body></body>
        <body></body>
      </html>
    `;

    const issues = await linter.lint(html, none, { "html-valid-content-model": true });
    expect(issues).to.have.lengthOf(2);
  });
});
