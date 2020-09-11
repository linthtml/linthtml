const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | head-valid-content-model", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should report an error for every invalid child", async function() {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <head>
        <div>a div</div>
        <p>a paragraph</p>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not report any error when <head> is not present", async function() {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <body></body>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for valid child element", async function() {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <head>
        <title></title>
        <link></link>
        <script></script>
        <style></style>
        <template></template>
        <noscript></noscript>
        <meta></meta>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Should not report any error for empty <head> element", async function() {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <head>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});

describe("head-valid-content-model", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error for every invalid child", async function() {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <head>
        <div>a div</div>
        <p>a paragraph</p>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not report any error when <head> is not present", async function() {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <body></body>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for valid child element", async function() {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <head>
        <title></title>
        <link></link>
        <script></script>
        <style></style>
        <template></template>
        <noscript></noscript>
        <meta></meta>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Should not report any error for empty <head> element", async function() {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <head>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
