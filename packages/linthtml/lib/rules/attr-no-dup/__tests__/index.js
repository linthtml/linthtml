const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | attr-no-dup", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report an error when an attribute is not duplicated", async function() {
    const linter = createLinter({ "attr-no-dup": true });
    const html = "<div class=\"foo\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when an attribute is duplicated", async function() {
    const linter = createLinter({ "attr-no-dup": true });
    const html = "<div class=\"foo\" class=\"foo\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should catch multiple duplicates in one element", async function() {
    const linter = createLinter({ "attr-no-dup": true });
    const html = "<div class=\"foo\" class=\"foo\" id=\"bar\" id=\"bar\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should catch duplicates on multiple elements", async function() {
    const linter = createLinter({ "attr-no-dup": true });
    const html = "<div class='foo' class='foo'><p id='bar' id='bar'>Text</p></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should be case insensitive", async function() {
    const linter = createLinter({ "attr-no-dup": true });
    const html = "<div class='foo' Class='foo'></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should throw an error when an invalid config is provided", function() {
    const linter = createLinter({ "attr-no-dup": "toto" });
    const html = `
      <div
        class="foo"
        id>
      </div>
    `;
    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"attr-no-dup\" is invalid: Expected boolean got string");
  });
});
describe("attr-no-dup", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report an error when an attribute is not duplicated", async function() {
    const linter = createLinter({
      "attr-no-dup": true
    });
    const html = "<div class=\"foo\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when an attribute is duplicated", async function() {
    const linter = createLinter({
      "attr-no-dup": true
    });
    const html = "<div class=\"foo\" class=\"foo\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should catch multiple duplicates in one element", async function() {
    const linter = createLinter({
      "attr-no-dup": true
    });
    const html = "<div class=\"foo\" class=\"foo\" id=\"bar\" id=\"bar\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should catch duplicates on multiple elements", async function() {
    const linter = createLinter({
      "attr-no-dup": true
    });
    const html = "<div class='foo' class='foo'><p id='bar' id='bar'>Text</p></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should be case insensitive", async function() {
    const linter = createLinter({
      "attr-no-dup": true
    });
    const html = "<div class='foo' Class='foo'></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  // handle by Config
  // it("Should throw an error when an invalid config is provided", function() {
  //   const config = {
  //     "attr-no-dup": [
  //       "toto"
  //     ]
  //   };
  //   expect(() => createLinter(config))
  //     .to
  //     .throw("Configuration for rule \"attr-no-dup\" is invalid: Expected boolean got string");
  // });
});
