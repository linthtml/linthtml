const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | focusable-tabindex-style", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should report errors for tag with positive tabindex", async function() {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="foo" tabindex="5">
      <label for="foo">Foo input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error for tag without tabindex attribute", async function() {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="foo">
      <label for="foo">Foo input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error for tag with negative tabindex", async function() {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="bar" tabindex="-5">
      <label for="bar">Bar input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error per tag with a positive tabindex", async function() {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="bar" tabindex="-5">
      <label for="bar">Bar input</label>
      <input type="text" name="foo" tabindex="5">
      <label for="foo">Foo input</label>
      <input type="text" name="baz" tabindex="-5">
      <label for="baz">Baz input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should ignore disabled tag", async function() {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="bar" tabindex="-5" disabled>
      <label for="bar">Bar input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report error for non interactive elements", async function() {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <div tabindex="5"></div>
    `;

    const issues = await linter.lint(html);

    expect(issues).to.have.lengthOf(1);
  });
});
describe("focusable-tabindex-style", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report errors for tag with positive tabindex", async function() {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="foo" tabindex="5">
      <label for="foo">Foo input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error for tag without tabindex attribute", async function() {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="foo">
      <label for="foo">Foo input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error for tag with negative tabindex", async function() {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="bar" tabindex="-5">
      <label for="bar">Bar input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error per tag with positive tabindex", async function() {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="bar" tabindex="-5">
      <label for="bar">Bar input</label>
      <input type="text" name="foo" tabindex="5">
      <label for="foo">Foo input</label>
      <input type="text" name="baz" tabindex="-5">
      <label for="baz">Baz input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should ignore disabled tag", async function() {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="bar" tabindex="-5" disabled>
      <label for="bar">Bar input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report error for non interactive elements", async function() {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <div tabindex="5"></div>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
});
