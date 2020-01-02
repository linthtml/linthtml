const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("html-req-lang", function() {
  it("Should not report any error when html tag as a none empty lang attribute", async function() {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      </html>
    `;

    const issues = await linter.lint(html, none, { "html-req-lang": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when html tag does not have a lang attribute", async function() {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
      <html>
      </html>
    `;

    const issues = await linter.lint(html, none, { "html-req-lang": true });
    expect(issues).to.have.lengthOf(1);
  });
});
describe("html-req-lang", function() {
  it("Should report an error for invalid lang code", async function() {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
      <html lang="foo">
      </html>
    `;

    const issues = await linter.lint(html, none, { "lang-style": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error for valid lang code", async function() {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    const issues = await linter.lint(html, none, { "lang-style": true });
    expect(issues).to.have.lengthOf(0);
  });

  // TODO: Should not
  it("Should allow empty lang tag", async function() {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
      <html lang="">
      </html>
    `;

    const issues = await linter.lint(html, none, { "lang-style": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error on wrong-case lang", async function() {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
      <html lang="en-us">
      </html>
    `;

    const issues = await linter.lint(html, none, { "lang-style": "case" });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any for correct case lang", async function() {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    const issues = await linter.lint(html, none, { "lang-style": "case" });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const linter = createLinter();
    const html = "";

    expect(() => linter.lint(html, none, { "lang-style": 0 }))
      .to
      .throw("Configuration for rule \"lang-style\" is invalid: Expected boolean got number");
  });

  it("Should throw an error for invalid config (not valid string)", function() {
    const linter = createLinter();
    const html = "";

    expect(() => linter.lint(html, none, { "lang-style": "foo" }))
      .to
      .throw("Configuration for rule \"lang-style\" is invalid: Only \"case\" is accepted as string value");
  });
});
