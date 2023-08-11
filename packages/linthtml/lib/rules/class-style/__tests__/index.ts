import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | class-style", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report any error for correctly formatted class", async () => {
    const linter = createLinter({ "class-style": "lowercase" });
    const html = '<div class="foo"></div>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  describe("'lowercase' format", () => {
    it("Should not report an error for classes with valid format", async () => {
      const linter = createLinter({ "class-style": "lowercase" });
      const html = '<div class="foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for classes with invalid format", async () => {
      const linter = createLinter({ "class-style": "lowercase" });
      const html = '<div class="FOO bar-foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });
  });

  describe("'dash' format", () => {
    it("Should not report an error for classes with valid format", async () => {
      const linter = createLinter({ "class-style": "dash" });
      const html = '<div class="bar-foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for classes with invalid format", async () => {
      const linter = createLinter({ "class-style": "dash" });
      const html = '<div class="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  describe("'underscore' format", () => {
    it("Should not report an error for classes with valid format", async () => {
      const linter = createLinter({ "class-style": "underscore" });
      const html = '<div class="bar_foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for classes with invalid format", async () => {
      const linter = createLinter({ "class-style": "underscore" });
      const html = '<div class="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  describe("'BEM' format", () => {
    it("Should not report an error for classes with valid format", async () => {
      const linter = createLinter({ "class-style": "bem" });
      const html = '<div class="block__element block--modifier"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for classes with invalid format", async () => {
      const linter = createLinter({ "class-style": "bem" });
      const html = '<div class="block--modifier--modifier block__element__element"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });
  });

  describe("'regexp' format", () => {
    it("Should not report an error for classes with valid format", async () => {
      const linter = createLinter({ "class-style": /^foo-\d+$/ });
      const html = '<div class="foo-1"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for classes with invalid format", async () => {
      const linter = createLinter({ "class-style": /^foo-\d+$/ });
      const html = '<div class="bar-2"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  it("Should fallback to `id-class-style` if `class-style` is false", async () => {
    const linter = createLinter({
      "class-style": false,
      "id-class-style": "lowercase"
    });
    const html = '<div class="FOO bar-foo"></div>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should not fallback to `id-class-style` if `class-style` is set to `none`", async () => {
    const linter = createLinter({
      "class-style": "none",
      "id-class-style": "lowercase"
    });
    const html = '<div class="FOO bar-foo"></div>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Rule should not fail if class attribute has no value", async () => {
    const linter = createLinter({ "class-style": "dash" });
    const html = `
      <div class></div>
    `;

    expect(() => linter.lint(html)).not.toThrow();
  });

  it("Should throw an error if `id-class-ignore-regex` is empty", () => {
    const linter = createLinter({
      "class-style": "dash",
      "id-class-ignore-regex": ""
    });
    const html = '<div class="bar-2"></div>';

    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "id-class-ignore-regex" is invalid: You provide an empty string value'
    );
  });

  it("Should throw an error for invalid config (wrong type)", () => {
    const linter = createLinter({ "class-style": 1 });
    const html = '<div class="bar-2"></div>';

    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "class-style" is invalid: Expected string or RegExp got number'
    );
  });

  it("Should throw an error for invalid config (invalid string value)", () => {
    const linter = createLinter({ "class-style": "foo" });
    const html = '<div class="bar-2"></div>';

    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "class-style" is invalid: "foo" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem".'
    );
  });
});

describe("class-style", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error for correctly formatted class", async () => {
    const linter = createLinter({
      "class-style": [true, "lowercase"]
    });
    const html = '<div class="foo"></div>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should deal with multiple spaces between classes", async () => {
    const linter = createLinter({
      "class-style": [true, "lowercase"]
    });
    const html = '<div class="foo  bar"></div>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  describe("'lowercase' format", () => {
    it("Should not report an error for classes with valid format", async () => {
      const linter = createLinter({
        "class-style": [true, "lowercase"]
      });
      const html = '<div class="foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for classes with invalid format", async () => {
      const linter = createLinter({
        "class-style": [true, "lowercase"]
      });
      const html = '<div class="FOO bar-foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });
  });

  describe("'dash' format", () => {
    it("Should not report an error for classes with valid format", async () => {
      const linter = createLinter({
        "class-style": [true, "dash"]
      });
      const html = '<div class="bar-foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for classes with invalid format", async () => {
      const linter = createLinter({
        "class-style": [true, "dash"]
      });
      const html = '<div class="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  describe("'underscore' format", () => {
    it("Should not report an error for classes with valid format", async () => {
      const linter = createLinter({
        "class-style": [true, "underscore"]
      });
      const html = '<div class="bar_foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for classes with invalid format", async () => {
      const linter = createLinter({
        "class-style": [true, "underscore"]
      });
      const html = '<div class="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  describe("'BEM' format", () => {
    it("Should not report an error for classes with valid format", async () => {
      const linter = createLinter({
        "class-style": [true, "bem"]
      });
      const html = '<div class="block__element block--modifier"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for classes with invalid format", async () => {
      const linter = createLinter({
        "class-style": [true, "bem"]
      });
      const html = '<div class="block--modifier--modifier block__element__element"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });
  });

  describe("'regexp' format", () => {
    it("Should not report an error for classes with valid format", async () => {
      const linter = createLinter({
        "class-style": [true, /^foo-\d+$/]
      });
      const html = '<div class="foo-1"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for classes with invalid format", async () => {
      const linter = createLinter({
        "class-style": [true, /^foo-\d+$/]
      });
      const html = '<div class="bar-2"></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  it("Should fallback to `id-class-style` if `class-style` is false", async () => {
    const linter = createLinter({
      "class-style": false,
      "id-class-style": [true, "lowercase"]
    });
    const html = '<div class="FOO bar-foo"></div>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should not fallback to `id-class-style` if `class-style` is set to `none`", async () => {
    const linter = createLinter({
      "class-style": [true, "none"],
      "id-class-style": [true, "lowercase"]
    });
    const html = '<div class="FOO bar-foo"></div>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
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

  it("Rule should not fail if class attribute has no value", async () => {
    const linter = createLinter({
      "class-style": [true, "dash"]
    });
    const html = `
      <div class></div>
    `;

    expect(() => linter.lint(html)).not.toThrow();
  });

  it("Should throw an error for invalid config (wrong type)", () => {
    const config = {
      "class-style": [true, 1] as [boolean, unknown]
    };

    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "class-style" is invalid: Expected string or RegExp got number'
    );
  });

  it("Should throw an error for invalid config (invalid string value)", () => {
    const config = {
      "class-style": [true, "foo"] as [boolean, unknown]
    };

    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "class-style" is invalid: "foo" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem".'
    );
  });
});
