const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

// TODO check issues positions

describe("legacy linter | attr-new-line", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report errors if the number of attributes is less or equal to the configuration", async function() {
    const linter = createLinter({ "attr-new-line": 2 });
    const html = `
      <div class="foo" id="bar"></div>
      <div class="foo"></div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors if the number of attributes is superior to the rule's configuration", async function() {
    const linter = createLinter({ "attr-new-line": 1 });
    const html = `
      <div class="foo" id="bar"></div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report errors when attributes are on new lines", async function() {
    const linter = createLinter({ "attr-new-line": 1 });
    const html = `
      <div class="foo"
            id="bar"
            attr></div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should accept less attributes per line than the value defined in the configuration", async function() {
    const linter = createLinter({ "attr-new-line": 2 });
    const html = `
      <div class="foo"
            id="bar"
            attr></div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when there's one attribute on the first line and configuration is '0'", async function() {
    const linter = createLinter({ "attr-new-line": 0 });
    const html = "<div class=\"foo\"></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error when there's one attribute per line and configuration is '0'", async function() {
    const linter = createLinter({ "attr-new-line": 0 });
    const html = `
      <div 
          id="bar"
          attr>
      </div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors when there's more than one attributes per line and configuration is '0'", async function() {
    const linter = createLinter({ "attr-new-line": 0 });
    const html = `
      <div 
          id="bar" attr>
      </div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error when there's one attribute on the first line and configuration is '+0'", async function() {
    const linter = createLinter({ "attr-new-line": "+0" });
    const html = "<div class=\"foo\"></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when there's more than one attribute on the first line and configuration is '+0'", async function() {
    const linter = createLinter({ "attr-new-line": "+0" });
    const html = "<div class=\"foo\" id=\"bar\"></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when there's more than one attribute on the second line and configuration is '+0'", async function() {
    const linter = createLinter({ "attr-new-line": "+0" });
    const html = `
      <div 
          id="bar" attr>
      </div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report errors when there's one attributes per line and configuration is '+0'", async function() {
    const linter = createLinter({ "attr-new-line": "+0" });
    const html = `
      <div
        class="foo"
        id>
      </div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error when an invalid config is provided", function() {
    const linter = createLinter({ "attr-new-line": "toto" });
    const html = `
      <div
        class="foo"
        id>
      </div>
    `;
    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"attr-new-line\" is invalid: Expected number or \"+0\" got string");
  });
});
describe("attr-new-line", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report errors if the number of attributes is less or equal to the configuration", async function() {
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

  it("Should not report an error when there's one attribute per line and configuration is '0'", async function() {
    const linter = createLinter({
      "attr-new-line": [
        true,
        0
      ]
    });
    const html = `
      <div 
          id="bar"
          attr>
      </div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors when there's more than one attributes per line and configuration is '0'", async function() {
    const linter = createLinter({
      "attr-new-line": [
        true,
        0
      ]
    });
    const html = `
      <div 
          id="bar" attr>
      </div>
    `;
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

  it("Should not report errors when there's one attributes per line and configuration is '+0'", async function() {
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
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when there's more than one attribute on the second line and configuration is '+0'", async function() {
    const linter = createLinter({
      "attr-new-line": [
        true,
        "+0"
      ]
    });
    const html = `
      <div 
          id="bar" attr>
      </div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
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
