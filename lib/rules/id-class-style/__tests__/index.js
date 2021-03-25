const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | id-style", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should ignore id matching \"raw-ignore-text\"", async function() {
    const linter = createLinter({ "id-class-style": "dash", "raw-ignore-regex": "{{.*?}}" });
    const html = "<div id=\"{{ if }} foo {{ else }} bar {{ end }}></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for correctly formatted class", async function() {
    const linter = createLinter({ "id-class-style": "lowercase" });
    const html = "<div id=\"foo\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  describe("'lowercase' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({ "id-class-style": "lowercase" });
      const html = "<div id=\"foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({ "id-class-style": "lowercase" });
      const html = "<div id=\"bar-foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'dash' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({ "id-class-style": "dash" });
      const html = "<div id=\"bar-foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({ "id-class-style": "dash" });
      const html = "<div id=\"BarFoo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'underscore' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({ "id-class-style": "underscore" });
      const html = "<div id=\"bar_foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({ "id-class-style": "underscore" });
      const html = "<div id=\"BarFoo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'BEM' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({ "id-class-style": "bem" });
      const html = "<div id=\"block__element\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({ "id-class-style": "bem" });
      const html = "<div id=\"block--modifier--modifier\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'regexp' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({ "id-class-style": /^foo-\d+$/ });
      const html = "<div id=\"foo-1\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({ "id-class-style": /^foo-\d+$/ });
      const html = "<div id=\"bar-2\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should throw an error if `id-class-ignore-regex` is empty", function() {
    const linter = createLinter({ "id-class-style": "dash", "id-class-ignore-regex": "" });
    const html = "<div id=\"bar-2\"></div>";

    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"id-class-ignore-regex\" is invalid: You provide an empty string value");
  });

  it("Rule should not fail if id attribute has no value", async function() {
    const linter = createLinter({ "id-style": "dash" });
    const html = `
      <div id></div>
    `;

    expect(() => linter.lint(html))
      .to
      .not
      .throw();
  });

  it("should throw an error if rule config is empty", function() {
    const linter = createLinter({ "id-style": "" });

    expect(() => linter.lint(""))
      .to
      .throw("Configuration for rule \"id-style\" is invalid: \"\" is not accepted. Accepted values are \"none\", \"lowercase\", \"underscore\", \"dash\", \"camel\" and \"bem\"");
  });

  it("should throw an error if rule config is provided with an invalid format", function() {
    const linter = createLinter({ "id-style": "foo" });

    expect(() => linter.lint(""))
      .to
      .throw("Configuration for rule \"id-style\" is invalid: \"foo\" is not accepted. Accepted values are \"none\", \"lowercase\", \"underscore\", \"dash\", \"camel\" and \"bem\"");
  });
});

describe("id-style", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should ignore id matching \"raw-ignore-text\"", async function() {
    const linter = linthtml.fromConfig({
      "raw-ignore-regex": "{{.*?}}",
      rules: {
        "id-class-style": [
          true,
          "dash"
        ]
      }
    });
    const html = "<div id=\"{{ if }} foo {{ else }} bar {{ end }}></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for correctly formatted class", async function() {
    const linter = createLinter({
      "id-class-style": [
        true,
        "lowercase"
      ]
    });
    const html = "<div id=\"foo\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  describe("'lowercase' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({
        "id-class-style": [
          true,
          "lowercase"
        ]
      });
      const html = "<div id=\"foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({
        "id-class-style": [
          true,
          "lowercase"
        ]
      });
      const html = "<div id=\"bar-foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'dash' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({
        "id-class-style": [
          true,
          "dash"
        ]
      });
      const html = "<div id=\"bar-foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({
        "id-class-style": [
          true,
          "dash"
        ]
      });
      const html = "<div id=\"BarFoo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'underscore' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({
        "id-class-style": [
          true,
          "underscore"
        ]
      });
      const html = "<div id=\"bar_foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({
        "id-class-style": [
          true,
          "underscore"
        ]
      });
      const html = "<div id=\"BarFoo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'BEM' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({
        "id-class-style": [
          true,
          "bem"
        ]
      });
      const html = "<div id=\"block__element\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({
        "id-class-style": [
          true,
          "bem"
        ]
      });
      const html = "<div id=\"block--modifier--modifier\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'regexp' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({
        "id-class-style": [
          true,
          /^foo-\d+$/
        ]
      });
      const html = "<div id=\"foo-1\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({
        "id-class-style": [
          true,
          /^foo-\d+$/
        ]
      });
      const html = "<div id=\"bar-2\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Rule should not fail if id attribute has no value", async function() {
    const linter = createLinter({
      "id-style": [
        true,
        "dash"
      ]
    });
    const html = `
      <div id></div>
    `;

    expect(() => linter.lint(html))
      .to
      .not
      .throw();
  });

  it("should throw an error if rule config is empty", function() {
    const config = {
      "id-style": [
        true,
        ""
      ]
    };

    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"id-style\" is invalid: \"\" is not accepted. Accepted values are \"none\", \"lowercase\", \"underscore\", \"dash\", \"camel\" and \"bem\"");
  });

  it("should throw an error if rule config is provided with an invalid format", function() {
    const config = {
      "id-style": [
        true,
        "foo"
      ]
    };

    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"id-style\" is invalid: \"foo\" is not accepted. Accepted values are \"none\", \"lowercase\", \"underscore\", \"dash\", \"camel\" and \"bem\"");
  });
});
