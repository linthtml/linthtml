const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | attr-new-line", function() {
  function createLinter() {
    return new linthtml.LegacyLinter(linthtml.rules);
  }
  it("Should not report errors if the number of atributes is less or equal to the configuration", async function() {
    const linter = createLinter();
    const html = `
      <div class="foo" id="bar"></div>
      <div class="foo"></div>
    `;
    const issues = await linter.lint(html, none, { "attr-new-line": 2 });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors if the number of attributes is superior to the rule's configuration", async function() {
    const linter = createLinter();
    const html = `
      <div class="foo" id="bar"></div>
    `;
    const issues = await linter.lint(html, none, { "attr-new-line": 1 });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report errors when attributes are on new lines", async function() {
    const linter = createLinter();
    const html = `
      <div class="foo"
            id="bar"
            attr></div>
    `;
    const issues = await linter.lint(html, none, { "attr-new-line": 1 });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should accept less attributes per line than the value defined in the configuration", async function() {
    const linter = createLinter();
    const html = `
      <div class="foo"
            id="bar"
            attr></div>
    `;
    const issues = await linter.lint(html, none, { "attr-new-line": 2 });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when there's one attribute on the first line and configuration is '0'", async function() {
    const linter = createLinter();
    const html = "<div class=\"foo\"></div>";
    const issues = await linter.lint(html, none, { "attr-new-line": 0 });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error when there's one attribute on the first line and configuration is '+0'", async function() {
    const linter = createLinter();
    const html = "<div class=\"foo\"></div>";
    const issues = await linter.lint(html, none, { "attr-new-line": "+0" });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when there's more than one attribute on the first line and configuration is '+0'", async function() {
    const linter = createLinter();
    const html = "<div class=\"foo\" id=\"bar\"></div>";
    const issues = await linter.lint(html, none, { "attr-new-line": "+0" });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when there's attributes on line > 1 and configuration is '+0'", async function() {
    const linter = createLinter();
    const html = `
      <div
        class="foo"
        id>
      </div>
    `;
    const issues = await linter.lint(html, none, { "attr-new-line": "+0" });
    expect(issues).to.have.lengthOf(2);
  });

  it("Should throw an error when an invalid config is provided", function() {
    const linter = createLinter();
    const html = `
      <div
        class="foo"
        id>
      </div>
    `;
    expect(() => linter.lint(html, none, { "attr-new-line": "toto" }))
      .to
      .throw("Configuration for rule \"attr-new-line\" is invalid: Expected number or \"+0\" got string");
  });
});
describe("attr-new-line", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report errors if the number of atributes is less or equal to the configuration", async function() {
    const linter = createLinter({
      "attr-new-line": [
        true,
        2
      ]
    });
    const html = `
      <div class="foo" id="bar"></div>
      <div class="foo"></div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors if the number of attributes is superior to the rule's configuration", async function() {
    const linter = createLinter({
      "attr-new-line": [
        true,
        1
      ]
    });
    const html = `
      <div class="foo" id="bar"></div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report errors when attributes are on new lines", async function() {
    const linter = createLinter({
      "attr-new-line": [
        true,
        1
      ]
    });
    const html = `
      <div class="foo"
            id="bar"
            attr></div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should accept less attributes per line than the value defined in the configuration", async function() {
    const linter = createLinter({
      "attr-new-line": [
        true,
        2
      ]
    });
    const html = `
      <div class="foo"
            id="bar"
            attr></div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when there's one attribute on the first line and configuration is '0'", async function() {
    const linter = createLinter({
      "attr-new-line": [
        true,
        0
      ]
    });
    const html = "<div class=\"foo\"></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error when there's one attribute on the first line and configuration is '+0'", async function() {
    const linter = createLinter({
      "attr-new-line": [
        true,
        "+0"
      ]
    });
    const html = "<div class=\"foo\"></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when there's more than one attribute on the first line and configuration is '+0'", async function() {
    const linter = createLinter({
      "attr-new-line": [
        true,
        "+0"
      ]
    });
    const html = "<div class=\"foo\" id=\"bar\"></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when there's attributes on line > 1 and configuration is '+0'", async function() {
    const linter = createLinter({
      "attr-new-line": [
        true,
        "+0"
      ]
    });
    const html = `
      <div
        class="foo"
        id>
      </div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should throw an error when an invalid config is provided", function() {
    const config = {
      "attr-new-line": [
        true,
        "toto"
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"attr-new-line\" is invalid: Expected number or \"+0\" got string");
  });
});
