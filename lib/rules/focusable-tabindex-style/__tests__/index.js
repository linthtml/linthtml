const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("focusable-tabindex-style", function() {
  it("Should not report any error for tag with positive tabindex", async function() {
    const linter = createLinter();
    const html = `
      <input type="text" name="foo" tabindex="5">
      <label for="foo">Foo input</label>
    `;

    const issues = await linter.lint(html, none, { "focusable-tabindex-style": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for tag without tabindex attribute", async function() {
    const linter = createLinter();
    const html = `
      <input type="text" name="foo">
      <label for="foo">Foo input</label>
    `;

    const issues = await linter.lint(html, none, { "focusable-tabindex-style": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for tag with negative tabindex", async function() {
    const linter = createLinter();
    const html = `
      <input type="text" name="bar" tabindex="-5">
      <label for="bar">Bar input</label>
    `;

    const issues = await linter.lint(html, none, { "focusable-tabindex-style": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error per tag with negative tabindex", async function() {
    const linter = createLinter();
    const html = `
      <input type="text" name="bar" tabindex="-5">
      <label for="bar">Bar input</label>
      <input type="text" name="foo" tabindex="5">
      <label for="foo">Foo input</label>
      <input type="text" name="baz" tabindex="-5">
      <label for="baz">Baz input</label>
    `;

    const issues = await linter.lint(html, none, { "focusable-tabindex-style": true });
    expect(issues).to.have.lengthOf(2);
  });

  it("Should ignore disabled tag", async function() {
    const linter = createLinter();
    const html = `
      <input type="text" name="bar" tabindex="-5" disabled>
      <label for="bar">Bar input</label>
    `;

    const issues = await linter.lint(html, none, { "focusable-tabindex-style": true });
    expect(issues).to.have.lengthOf(0);
  });
});
