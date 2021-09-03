const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | class-style", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report any error for correctly formatted class", async function() {
    const linter = createLinter({ "class-style": "lowercase" });
    const html = "<div class=\"foo\"></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  describe("'lowercase' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({ "class-style": "lowercase" });
      const html = "<div class=\"foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({ "class-style": "lowercase" });
      const html = "<div class=\"FOO bar-foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("'dash' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({ "class-style": "dash" });
      const html = "<div class=\"bar-foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({ "class-style": "dash" });
      const html = "<div class=\"BarFoo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'underscore' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({ "class-style": "underscore" });
      const html = "<div class=\"bar_foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({ "class-style": "underscore" });
      const html = "<div class=\"BarFoo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'BEM' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({ "class-style": "bem" });
      const html = "<div class=\"block__element block--modifier\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({ "class-style": "bem" });
      const html = "<div class=\"block--modifier--modifier block__element__element\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("'regexp' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({ "class-style": /^foo-\d+$/ });
      const html = "<div class=\"foo-1\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({ "class-style": /^foo-\d+$/ });
      const html = "<div class=\"bar-2\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should fallback to `id-class-style` if `class-style` is false", async function() {
    const linter = createLinter({ "class-style": false, "id-class-style": "lowercase" });
    const html = "<div class=\"FOO bar-foo\"></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not fallback to `id-class-style` if `class-style` is set to `none`", async function() {
    const linter = createLinter({ "class-style": "none", "id-class-style": "lowercase" });
    const html = "<div class=\"FOO bar-foo\"></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Rule should not fail if class attribute has no value", async function() {
    const linter = createLinter({ "class-style": "dash" });
    const html = `
      <div class></div>
    `;

    expect(() => linter.lint(html))
      .to
      .not
      .throw();
  });

  it("Should throw an error if `id-class-ignore-regex` is empty", function() {
    const linter = createLinter({ "class-style": "dash", "id-class-ignore-regex": "" });
    const html = "<div class=\"bar-2\"></div>";

    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"id-class-ignore-regex\" is invalid: You provide an empty string value");
  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const linter = createLinter({ "class-style": 1 });
    const html = "<div class=\"bar-2\"></div>";

    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"class-style\" is invalid: Expected string or RegExp got number");
  });

  it("Should throw an error for invalid config (invalid string value)", function() {
    const linter = createLinter({ "class-style": "foo" });
    const html = "<div class=\"bar-2\"></div>";

    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"class-style\" is invalid: \"foo\" is not accepted. Accepted values are \"none\", \"lowercase\", \"underscore\", \"dash\", \"camel\" and \"bem\".");
  });
});

describe("class-style", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error for correctly formatted class", async function() {
    const linter = createLinter({
      "class-style": [
        true,
        "lowercase"
      ]
    });
    const html = "<div class=\"foo\"></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should deal with multiple spaces between classes", async function() {
    const linter = createLinter({
      "class-style": [
        true,
        "lowercase"
      ]
    });
    const html = "<div class=\"foo  bar\"></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  describe("'lowercase' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({
        "class-style": [
          true,
          "lowercase"
        ]
      });
      const html = "<div class=\"foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({
        "class-style": [
          true,
          "lowercase"
        ]
      });
      const html = "<div class=\"FOO bar-foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("'dash' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({
        "class-style": [
          true,
          "dash"
        ]
      });
      const html = "<div class=\"bar-foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({
        "class-style": [
          true,
          "dash"
        ]
      });
      const html = "<div class=\"BarFoo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'underscore' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({
        "class-style": [
          true,
          "underscore"
        ]
      });
      const html = "<div class=\"bar_foo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({
        "class-style": [
          true,
          "underscore"
        ]
      });
      const html = "<div class=\"BarFoo\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'BEM' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({
        "class-style": [
          true,
          "bem"
        ]
      });
      const html = "<div class=\"block__element block--modifier\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({
        "class-style": [
          true,
          "bem"
        ]
      });
      const html = "<div class=\"block--modifier--modifier block__element__element\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("'regexp' format", function() {
    it("Should not report an error for classes with valid format", async function() {
      const linter = createLinter({
        "class-style": [
          true,
          /^foo-\d+$/
        ]
      });
      const html = "<div class=\"foo-1\"></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function() {
      const linter = createLinter({
        "class-style": [
          true,
          /^foo-\d+$/
        ]
      });
      const html = "<div class=\"bar-2\"></div>";
      const issues = await linter.lint(html, none);
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should fallback to `id-class-style` if `class-style` is false", async function() {
    const linter = createLinter({
      "class-style": false,
      "id-class-style": [
        true,
        "lowercase"
      ]
    });
    const html = "<div class=\"FOO bar-foo\"></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not fallback to `id-class-style` if `class-style` is set to `none`", async function() {
    const linter = createLinter({
      "class-style": [
        true,
        "none"
      ],
      "id-class-style": [
        true,
        "lowercase"
      ]
    });
    const html = "<div class=\"FOO bar-foo\"></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  // Not a rule for the new linter
  // it("Should throw an error if `id-class-ignore-regex` is empty", function() {
  //   const config = {
  //     "id-class-ignore-regex": [true, ""]
  //   };

  //   expect(() => createLinter(config))
  //     .to
  //     .throw("Configuration for rule \"id-class-ignore-regex\" is invalid: You provide an empty string value");
  // });

  it("Rule should not fail if class attribute has no value", async function() {
    const linter = createLinter({
      "class-style": [
        true,
        "dash"
      ]
    });
    const html = `
      <div class></div>
    `;

    expect(() => linter.lint(html))
      .to
      .not
      .throw();
  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const config = {
      "class-style": [
        true,
        1
      ]
    };

    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"class-style\" is invalid: Expected string or RegExp got number");
  });

  it("Should throw an error for invalid config (invalid string value)", function() {
    const config = {
      "class-style": [
        true,
        "foo"
      ]
    };

    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"class-style\" is invalid: \"foo\" is not accepted. Accepted values are \"none\", \"lowercase\", \"underscore\", \"dash\", \"camel\" and \"bem\".");
  });
});
