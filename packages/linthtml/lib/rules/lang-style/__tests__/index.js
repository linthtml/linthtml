const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | lang-style", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should report an error for invalid lang code", async function() {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="foo">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error for valid lang code", async function() {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  // TODO: Should not
  it("Should allow empty lang tag", async function() {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error on wrong-case lang", async function() {
    const linter = createLinter({ "lang-style": "case" });
    const html = `
      <!DOCTYPE html>
      <html lang="en-us">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any for correct case lang", async function() {
    const linter = createLinter({ "lang-style": "case" });
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const linter = createLinter({ "lang-style": 0 });
    const html = "";

    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"lang-style\" is invalid: Expected boolean got number");
  });

  it("Should throw an error for invalid config (not valid string)", function() {
    const linter = createLinter({ "lang-style": "foo" });
    const html = "";

    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"lang-style\" is invalid: Only \"case\" is accepted as string value");
  });
});
describe("lang-style", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error for invalid lang code", async function() {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="foo">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error for valid lang code", async function() {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  // TODO: Should not
  it("Should allow empty lang tag", async function() {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error on wrong-case lang", async function() {
    const linter = createLinter({
      "lang-style": [
        true,
        "case"
      ]
    });
    const html = `
      <!DOCTYPE html>
      <html lang="en-us">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any for correct case lang", async function() {
    const linter = createLinter({
      "lang-style": [
        true,
        "case"
      ]
    });
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const config = {
      "lang-style": [
        true,
        0
      ]
    };

    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"lang-style\" is invalid: Expected boolean got number");
  });

  it("Should throw an error for invalid config (not valid string)", function() {
    const config = {
      "lang-style": [
        true,
        "foo"
      ]
    };

    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"lang-style\" is invalid: Only \"case\" is accepted as string value");
  });
});
