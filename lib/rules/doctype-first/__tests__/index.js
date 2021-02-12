const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | doctype-first", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report any error when DOCTYPE is first", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <!DOCTYPE>
      <html></html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should be case-insensitive", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <!doctype>
      <html></html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when doctype is not present", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <html></html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when DOCTYPE is not first", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <html></html>
      <!DOCTYPE>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error when there's multiple DOCTYPE (if one is first)", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <!DOCTYPE>
      <!DOCTYPE>
      <html></html>
      <!DOCTYPE>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  // should report an error
  it("Should not report any error if the first element is not an html tag", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      foobar
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  // should report an error
  it("Should not report any error if the first element is a comment", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <!-- A comment -->
      <!DOCTYPE>
      <html></html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  describe("`smart` mode", function() {
    it("Should not report any error when there's no doctype and <head>", async function() {
      const linter = createLinter({ "doctype-first": "smart" });
      const html = `
        <section></section>
      `;

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error when there's no doctype but an <head>", async function() {
      const linter = createLinter({ "doctype-first": "smart" });
      const html = `
        <head></head>
        <section></section>
      `;

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const linter = createLinter({ "doctype-first": 0 });
    const html = "<div class=\"foo\"></div>";

    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"doctype-first\" is invalid: Expected boolean got number");
  });

  it("Should throw an error for invalid config (not valid string)", function() {
    const linter = createLinter({ "doctype-first": "foo" });
    const html = "<div class=\"bar\"></div>";

    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"doctype-first\" is invalid: Only \"smart\" is accepted as string value");
  });
});
describe("doctype-first", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error when DOCTYPE is first", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <!DOCTYPE>
      <html></html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should be case-insensitive", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <!doctype>
      <html></html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when doctype is not present", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <html></html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when DOCTYPE is not first", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <html></html>
      <!DOCTYPE>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error when there's multiple DOCTYPE (if one is first)", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <!DOCTYPE>
      <!DOCTYPE>
      <html></html>
      <!DOCTYPE>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  // should report an error
  it("Should not report any error if the first element is not an html tag", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      foobar
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  // should report an error
  it("Should not report any error if the first element is a comment", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <!-- A comment -->
      <!DOCTYPE>
      <html></html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  // should report an error
  it("Should report if first node is a comment an second is not the doctype", async function() {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <!-- A comment -->
      <html></html>
      <!DOCTYPE>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  describe("`smart` mode", function() {
    it("Should not report any error when there's no doctype and <head>", async function() {
      const linter = createLinter({
        "doctype-first": [
          true,
          "smart"
        ]
      });
      const html = `
        <section></section>
      `;

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error when there's no doctype but an <head>", async function() {
      const linter = createLinter({
        "doctype-first": [
          true,
          "smart"
        ]
      });
      const html = `
        <head></head>
        <section></section>
      `;

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const config = {
      "doctype-first": [
        true,
        0
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"doctype-first\" is invalid: Expected boolean got number");
  });

  it("Should throw an error for invalid config (not valid string)", function() {
    const config = {
      "doctype-first": [
        true,
        "foo"
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"doctype-first\" is invalid: Only \"smart\" is accepted as string value");
  });
});
