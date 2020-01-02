const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("class-style", function() {
  it("Should not report any error for correctly formatted class", async function() {
    const linter = createLinter();
    const html = "<div class=\"foo\"></div>";
    const issues = await linter.lint(html, none, { "class-style": "lowercase" });
    expect(issues).to.have.lengthOf(0);
  });

  describe("'lowercase' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter();
      const html = "<div class=\"foo\"></div>";
      const issues = await linter.lint(html, none, { "class-style": "lowercase" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter();
      const html = "<div class=\"FOO bar-foo\"></div>";
      const issues = await linter.lint(html, none, { "class-style": "lowercase" });
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("'dash' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter();
      const html = "<div class=\"bar-foo\"></div>";
      const issues = await linter.lint(html, none, { "class-style": "dash" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter();
      const html = "<div class=\"BarFoo\"></div>";
      const issues = await linter.lint(html, none, { "class-style": "dash" });
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'underscore' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter();
      const html = "<div class=\"bar_foo\"></div>";
      const issues = await linter.lint(html, none, { "class-style": "underscore" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter();
      const html = "<div class=\"BarFoo\"></div>";
      const issues = await linter.lint(html, none, { "class-style": "underscore" });
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'BEM' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter();
      const html = "<div class=\"block__element block--modifier\"></div>";
      const issues = await linter.lint(html, none, { "class-style": "bem" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter();
      const html = "<div class=\"block--modifier--modifier block__element__element\"></div>";
      const issues = await linter.lint(html, none, { "class-style": "bem" });
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("'regexp' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter();
      const html = "<div class=\"foo-1\"></div>";
      const issues = await linter.lint(html, none, { "class-style": /^foo-\d+$/ });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter();
      const html = "<div class=\"bar-2\"></div>";
      const issues = await linter.lint(html, none, { "class-style": /^foo-\d+$/ });
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should fallback to `id-class-style` if `class-style` is false", async function() {
    const linter = createLinter();
    const html = "<div class=\"FOO bar-foo\"></div>";
    const issues = await linter.lint(html, none, { "class-style": false, "id-class-style": "lowercase" });
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not fallback to `id-class-style` if `class-style` is set to `none`", async function() {
    const linter = createLinter();
    const html = "<div class=\"FOO bar-foo\"></div>";
    const issues = await linter.lint(html, none, { "class-style": "none", "id-class-style": "lowercase" });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error if `id-class-ignore-regex` is empty", function() {
    const linter = createLinter();
    const html = "<div class=\"bar-2\"></div>";

    expect(() => linter.lint(html, none, { "class-style": "dash", "id-class-ignore-regex": "" }))
      .to
      .throw("Configuration for rule \"id-class-ignore-regex\" is invalid: You provide an empty string value");
  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const linter = createLinter();
    const html = "<div class=\"bar-2\"></div>";

    expect(() => linter.lint(html, none, { "class-style": 1 }))
      .to
      .throw("Configuration for rule \"class-style\" is invalid: Expected string|regexp got number");
  });

  it("Should throw an error for invalid config (invalid string value)", function() {
    const linter = createLinter();
    const html = "<div class=\"bar-2\"></div>";

    expect(() => linter.lint(html, none, { "class-style": "foo" }))
      .to
      .throw("Configuration for rule \"class-style\" is invalid: \"foo\" is not accepted. Accepted values are \"none\", \"lowercase\", \"underscore\", \"dash\", \"camel\" and \"bem\".");
  });
});
