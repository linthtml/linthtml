const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | img-req-alt", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report any error for <img> with an alt value", async function() {
    const linter = createLinter({ "img-req-alt": true });
    const html = "<img src=\"cat.jpg\" alt=\"A cat picture\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for <img> without an alt value", async function() {
    const linter = createLinter({ "img-req-alt": true });
    const html = "<img src=\"cat.jpg\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error for <img> with an empty alt value", async function() {
    const linter = createLinter({ "img-req-alt": true });
    const html = "<img src=\"cat.jpg\" alt=\"\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should check only <img> ", async function() {
    const linter = createLinter({ "img-req-alt": true });
    const html = "<div alt=\"\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  describe("\"allownull\" option", function() {
    it("Should not report error for <img> with an empty alt value", async function() {
      const linter = createLinter({ "img-req-alt": "allownull" });
      const html = "<img src=\"cat.jpg\" alt=\"\">";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for <img> without an alt value", async function() {
      const linter = createLinter({ "img-req-alt": "allownull" });
      const html = "<img src=\"cat.jpg\">";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const linter = createLinter({ "img-req-alt": 0 });
    const html = "<img src=\"cat.jpg\">";

    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"img-req-alt\" is invalid: Expected boolean got number");
  });

  it("Should throw an error for invalid config (not valid string)", function() {
    const linter = createLinter({ "img-req-alt": "foo" });
    const html = "<img src=\"cat.jpg\">";

    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"img-req-alt\" is invalid: Only \"allownull\" is accepted as string value");
  });
});

describe("img-req-alt", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error for <img> with an alt value", async function() {
    const linter = createLinter({ "img-req-alt": true });
    const html = "<img src=\"cat.jpg\" alt=\"A cat picture\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for <img> without an alt value", async function() {
    const linter = createLinter({ "img-req-alt": true });
    const html = "<img src=\"cat.jpg\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error for <img> with an empty alt value", async function() {
    const linter = createLinter({ "img-req-alt": true });
    const html = "<img src=\"cat.jpg\" alt=\"\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should check only <img> ", async function() {
    const linter = createLinter({ "img-req-alt": true });
    const html = "<div alt=\"\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  describe("\"allownull\" option", function() {
    it("Should not report error for <img> with an empty alt value", async function() {
      const linter = createLinter({
        "img-req-alt": [
          true,
          "allownull"
        ]
      });
      const html = "<img src=\"cat.jpg\" alt=\"\">";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for <img> without an alt value", async function() {
      const linter = createLinter({
        "img-req-alt": [
          true,
          "allownull"
        ]
      });
      const html = "<img src=\"cat.jpg\">";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const config = {
      "img-req-alt": [
        true,
        0
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"img-req-alt\" is invalid: Expected boolean got number");
  });

  it("Should throw an error for invalid config (not valid string)", function() {
    const config = {
      "img-req-alt": [
        true,
        "foo"
      ]
    };

    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"img-req-alt\" is invalid: Only \"allownull\" is accepted as string value");
  });
});
