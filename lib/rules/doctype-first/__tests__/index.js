const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("doctype-first", function() {
  it("Should not report any error when DOCTYPE is first", async function() {
    const linter = createLinter();
    const html = `
      <!DOCTYPE>
      <html></html>
    `;

    const issues = await linter.lint(html, none, { "doctype-first": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should be case-insensitive", async function() {
    const linter = createLinter();
    const html = `
      <!doctype>
      <html></html>
    `;

    const issues = await linter.lint(html, none, { "doctype-first": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when doctype is not present", async function() {
    const linter = createLinter();
    const html = `
      <html></html>
    `;

    const issues = await linter.lint(html, none, { "doctype-first": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when DOCTYPE is not first", async function() {
    const linter = createLinter();
    const html = `
      <html></html>
      <!DOCTYPE>
    `;

    const issues = await linter.lint(html, none, { "doctype-first": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error when there's mutiple DOCTYPE (if one is first)", async function() {
    const linter = createLinter();
    const html = `
      <!DOCTYPE>
      <!DOCTYPE>
      <html></html>
      <!DOCTYPE>
    `;

    const issues = await linter.lint(html, none, { "doctype-first": true });
    expect(issues).to.have.lengthOf(0);
  });

  // should report an error
  it("Should not report any error if the firt element is not an html tag", async function() {
    const linter = createLinter();
    const html = `
      foobar
    `;

    const issues = await linter.lint(html, none, { "doctype-first": true });
    expect(issues).to.have.lengthOf(1);
  });

  // should report an error
  it("Should not report any error if the firt element is a comment", async function() {
    const linter = createLinter();
    const html = `
      <!-- A comment -->
      <!DOCTYPE>
      <html></html>
    `;

    const issues = await linter.lint(html, none, { "doctype-first": true });
    expect(issues).to.have.lengthOf(0);
  });

  describe("`smart` mode", function() {
    it("Should not report any error when there's no doctype and <head>", async function() {
      const linter = createLinter();
      const html = `
        <section></section>
      `;

      const issues = await linter.lint(html, none, { "doctype-first": "smart" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error when there's no doctype but an <head>", async function() {
      const linter = createLinter();
      const html = `
        <head></head>
        <section></section>
      `;

      const issues = await linter.lint(html, none, { "doctype-first": "smart" });
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const linter = createLinter();
    const html = "<div class=\"foo\"></div>";

    expect(() => linter.lint(html, none, { "doctype-first": 0 }))
      .to
      .throw("Configuration for rule \"doctype-first\" is invalid: Expected boolean got number");
  });

  it("Should throw an error for invalid config (not valid string)", function() {
    const linter = createLinter();
    const html = "<div class=\"bar\"></div>";

    expect(() => linter.lint(html, none, { "doctype-first": "foo" }))
      .to
      .throw("Configuration for rule \"doctype-first\" is invalid: Only \"smart\" is accepted as string value");
  });
});
