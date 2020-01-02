const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("attr-name-style", function() {
  it("Should ignore attributes matching \"raw-ignore-text\"", async function() {
    const linter = createLinter();
    const html = "<div an-attribute {{ logic }} another-attribute {{ end }}></div>";
    const issues = await linter.lint(html, none, { "attr-name-style": "dash", "raw-ignore-regex": "{{.*?}}" });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report anything for correctly styled attribute names", async function() {
    const linter = createLinter();
    const html = "<div abc=\"\" fowj0wo3=\"\"></div>";
    const issues = await linter.lint(html, none, { "attr-name-style": "lowercase" });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should ignore ignored attributes", async function() {
    const linter = createLinter();
    const html = "<xml xlink:href=\"\"></xml>";
    const issues = await linter.lint(html, none, { "attr-name-style": "dash", "attr-name-ignore-regex": "xlink:href" });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report anything when disabled", async function() {
    const linter = createLinter();
    const html = "<div abc=\"\" 2fOwj_0o-3=\"\"></div>";
    const issues = await linter.lint(html, none, { "attr-name-style": false });
    expect(issues).to.have.lengthOf(0);
  });

  describe("'lowercase' format", function() {
    it("Should not report an error for attributes with valid format", async function() {
      const linter = createLinter();
      const html = "<div foo=\"\"></div>";
      const issues = await linter.lint(html, none, { "attr-name-style": "lowercase" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for attributes with invalid format", async function() {
      const linter = createLinter();
      const html = "<div FooBar=\"\" foo-bar=\"\"></div>";
      const issues = await linter.lint(html, none, { "attr-name-style": "lowercase" });
      expect(issues).to.have.lengthOf(2);
    });
  });
  describe("'dash' format", function() {
    it("Should not report an error for attributes with valid format", async function() {
      const linter = createLinter();
      const html = "<div foo-bar=\"\"></div>";
      const issues = await linter.lint(html, none, { "attr-name-style": "dash" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for attributes with invalid format", async function() {
      const linter = createLinter();
      const html = "<div FooBar=\"\" foo_bar=\"\"></div>";
      const issues = await linter.lint(html, none, { "attr-name-style": "dash" });
      expect(issues).to.have.lengthOf(2);
    });
  });

  it("Should throw an error when an invalid config is passed", function() {
    const linter = createLinter();
    const html = "<button style=\"color: red;\"></button>";
    expect(() => linter.lint(html, none, { "attr-name-style": ["camel"] }))
      .to
      .throw("Configuration for rule \"attr-name-style\" is invalid: Expected string or RegExp got object");
  });

  describe("'regexp' format", function() {
    it("Should not report an error for attributes with valid format", async function() {
      const linter = createLinter();
      const html = "<div foo=\"\"></div>";
      const issues = await linter.lint(html, none, { "attr-name-style": /^[0-9a-o]+$/ });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for attributes with invalid format", async function() {
      const linter = createLinter();
      const html = "<div bar></div>";
      const issues = await linter.lint(html, none, { "attr-name-style": /^[0-9a-o]+$/ });
      expect(issues).to.have.lengthOf(1);
    });
  });
  describe("'camel' format", function() {
    it("Should not report an error for attributes with valid format", async function() {
      const linter = createLinter();
      const html = "<div FooBar=\"\"></div>";
      const issues = await linter.lint(html, none, { "attr-name-style": "camel" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for attributes with invalid format", async function() {
      const linter = createLinter();
      const html = "<div foo-bar></div>";
      const issues = await linter.lint(html, none, { "attr-name-style": "camel" });
      expect(issues).to.have.lengthOf(1);
    });
  });
});
// NOPE
//   {
//     input: '<div deadbeef1337="" fail="" fails=""></div>',
//     opts: { "attr-name-style": "/^[0-9a-f]+$/g" },
//     output: 2
//   }
// ];
