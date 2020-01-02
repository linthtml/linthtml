const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("id-style", function() {
  it("Should ignore id matching \"raw-ignore-text\"", async function() {
    const linter = createLinter();
    const html = "<div id=\"{{ if }} foo {{ else }} bar {{ end }}></div>";
    const issues = await linter.lint(html, none, { "id-class-style": "dash", "raw-ignore-regex": "{{.*?}}" });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for correctly formatted class", async function() {
    const linter = createLinter();
    const html = "<div id=\"foo\"></div>";

    const issues = await linter.lint(html, none, { "id-class-style": "lowercase" });
    expect(issues).to.have.lengthOf(0);
  });

  describe("'lowercase' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter();
      const html = "<div id=\"foo\"></div>";
      const issues = await linter.lint(html, none, { "id-class-style": "lowercase" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter();
      const html = "<div id=\"bar-foo\"></div>";
      const issues = await linter.lint(html, none, { "id-class-style": "lowercase" });
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'dash' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter();
      const html = "<div id=\"bar-foo\"></div>";
      const issues = await linter.lint(html, none, { "id-class-style": "dash" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter();
      const html = "<div id=\"BarFoo\"></div>";
      const issues = await linter.lint(html, none, { "id-class-style": "dash" });
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'underscore' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter();
      const html = "<div id=\"bar_foo\"></div>";
      const issues = await linter.lint(html, none, { "id-class-style": "underscore" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter();
      const html = "<div id=\"BarFoo\"></div>";
      const issues = await linter.lint(html, none, { "id-class-style": "underscore" });
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'BEM' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter();
      const html = "<div id=\"block__element\"></div>";
      const issues = await linter.lint(html, none, { "id-class-style": "bem" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter();
      const html = "<div id=\"block--modifier--modifier\"></div>";
      const issues = await linter.lint(html, none, { "id-class-style": "bem" });
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'regexp' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter();
      const html = "<div id=\"foo-1\"></div>";
      const issues = await linter.lint(html, none, { "id-class-style": /^foo-\d+$/ });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter();
      const html = "<div id=\"bar-2\"></div>";
      const issues = await linter.lint(html, none, { "id-class-style": /^foo-\d+$/ });
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should throw an error if `id-class-ignore-regex` is empty", function() {
    const linter = createLinter();
    const html = "<div id=\"bar-2\"></div>";

    expect(() => linter.lint(html, none, { "id-class-style": "dash", "id-class-ignore-regex": "" }))
      .to
      .throw("Configuration for rule \"id-class-ignore-regex\" is invalid: You provide an empty string value");
  });
});
