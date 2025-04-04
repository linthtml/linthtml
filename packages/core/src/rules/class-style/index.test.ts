import { expect } from "chai";
import linthtml from "../../index.js";
import { presets } from "../../presets/index.js";
import type { LegacyLinterConfig, RuleConfig } from "../../read-config.js";

describe("legacy linter | class-style", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }

  it("Should throw an error if `id-class-ignore-regex` is empty", function () {
    const linter = createLinter({
      "class-style": "dash",
      "id-class-ignore-regex": ""
    });
    const html = '<div class="bar-2"></div>';

    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "id-class-ignore-regex" is invalid: You provide an empty string value'
    );
  });

  it("Should throw an error for invalid config (wrong type)", function () {
    const linter = createLinter({ "class-style": 1 });
    const html = '<div class="bar-2"></div>';

    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "class-style" is invalid: Expected string or RegExp got number'
    );
  });

  it("Should throw an error for invalid config (invalid string value)", function () {
    const linter = createLinter({ "class-style": "foo" });
    const html = '<div class="bar-2"></div>';

    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "class-style" is invalid: "foo" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem".'
    );
  });

  it("should throw an error if object config as invalid key", function () {
    const linter = createLinter({ "class-style": { foo: "" } });

    expect(() => linter.lint("")).to.throw(
      'Object configuration for rule "class-style" is invalid: key "foo" is not accepted, only "format", "ignore" are.'
    );
  });

  it("Should throw an error when the value for the config key format is not valid", function () {
    const linter = createLinter({ "class-style": { format: ["camel"] } });

    expect(() => linter.lint("")).to.throw(
      'Object configuration for rule "class-style" is invalid: Setting "format" is not valid: Expected string or RegExp got array'
    );
  });

  it("Should throw an error when the value for the config key ignore is not valid", function () {
    const linter = createLinter({ "class-style": { format: "camel", ignore: 1 } });

    expect(() => linter.lint("")).to.throw(
      'Object configuration for rule "class-style" is invalid: Setting "ignore" is not valid: Expected string or RegExp got number'
    );
  });

  it("Should throw an error when the key 'format' is missing in the config object", function () {
    const linter = createLinter({ "class-style": { ignore: "" } });

    expect(() => linter.lint("")).to.throw(
      'Object configuration for rule "class-style" is invalid: Setting "format" is missing'
    );
  });

  it("Should throw an error when an invalid format is passed within the object config", function () {
    const linter = createLinter({ "class-style": { format: "foo" } });

    expect(() => linter.lint("")).to.throw(
      'Object configuration for rule "class-style" is invalid: Setting "format" is not valid: "foo" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem".'
    );
  });

  it("Should not throw an error when a valid config object is provided", function () {
    const linter = createLinter({ "class-style": { format: "camel" } });

    expect(() => linter.lint("")).to.not.throw();
  });

  it("Should not report any error for correctly formatted class", async function () {
    const linter = createLinter({ "class-style": "lowercase" });
    const html = '<div class="foo"></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  describe("'lowercase' format", function () {
    it("Should not report an error for classes with valid format", async function () {
      const linter = createLinter({ "class-style": { format: "lowercase" } });
      const html = '<div class="foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function () {
      const linter = createLinter({ "class-style": "lowercase" });
      const html = '<div class="FOO bar-foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("'dash' format", function () {
    it("Should not report an error for classes with valid format", async function () {
      const linter = createLinter({ "class-style": "dash" });
      const html = '<div class="bar-foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function () {
      const linter = createLinter({ "class-style": "dash" });
      const html = '<div class="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'underscore' format", function () {
    it("Should not report an error for classes with valid format", async function () {
      const linter = createLinter({ "class-style": "underscore" });
      const html = '<div class="bar_foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function () {
      const linter = createLinter({ "class-style": "underscore" });
      const html = '<div class="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'BEM' format", function () {
    it("Should not report an error for classes with valid format", async function () {
      const linter = createLinter({ "class-style": "bem" });
      const html = '<div class="block__element block--modifier"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function () {
      const linter = createLinter({ "class-style": "bem" });
      const html = '<div class="block--modifier--modifier block__element__element"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("'regexp' format", function () {
    it("Should not report an error for classes with valid format", async function () {
      const linter = createLinter({ "class-style": /^foo-\d+$/ });
      const html = '<div class="foo-1"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function () {
      const linter = createLinter({ "class-style": /^foo-\d+$/ });
      const html = '<div class="bar-2"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should fallback to `id-class-style` if `class-style` is false", async function () {
    const linter = createLinter({
      "class-style": false,
      "id-class-style": "lowercase"
    });
    const html = '<div class="FOO bar-foo"></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(3); // 1 for rule deprecation and 2 for rule issue
    expect(issues[0].severity).to.equal("warning");
    expect(issues[0].code).to.equal("DEPRECATED_RULE");
    expect(issues[1].code).to.equal("E011");
    expect(issues[1].code).to.equal("E011");
  });

  it("Should not fallback to `id-class-style` if `class-style` is set to `none`", async function () {
    const linter = createLinter({
      "class-style": "none",
      "id-class-style": "lowercase"
    });
    const html = '<div class="FOO bar-foo"></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].severity).to.equal("warning");
    expect(issues[0].code).to.equal("DEPRECATED_RULE");
  });

  it("Rule should not fail if class attribute has no value", function () {
    const linter = createLinter({ "class-style": "dash" });
    const html = `
      <div class></div>
    `;

    expect(() => linter.lint(html)).to.not.throw();
  });
});

describe("class-style", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }

  it("Should throw an error for invalid config (wrong type)", function () {
    const config = {
      "class-style": [true, 1] as [boolean, unknown]
    };

    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "class-style" is invalid: Expected string or RegExp got number'
    );
  });

  it("Should throw an error for invalid config (invalid string value)", function () {
    const config = {
      "class-style": [true, "foo"] as [boolean, unknown]
    };

    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "class-style" is invalid: "foo" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem".'
    );
  });

  it("should throw an error if object config as invalid key", function () {
    const config = { "class-style": [true, { foo: "" }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "class-style" is invalid: key "foo" is not accepted, only "format", "ignore" are.'
    );
  });

  it("Should throw an error when the value for the config key format is not valid", function () {
    const config = { "class-style": [true, { format: ["camel"] }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "class-style" is invalid: Setting "format" is not valid: Expected string or RegExp got array'
    );
  });

  it("Should throw an error when the value for the config key ignore is not valid", function () {
    const config = { "class-style": [true, { format: "camel", ignore: 1 }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "class-style" is invalid: Setting "ignore" is not valid: Expected string or RegExp got number'
    );
  });

  it("Should throw an error when the key 'format' is missing in the config object", function () {
    const config = { "class-style": [true, { ignore: "" }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "class-style" is invalid: Setting "format" is missing'
    );
  });

  it("Should throw an error when an invalid format is passed within the object config", function () {
    const config = { "class-style": [true, { format: "foo" }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "class-style" is invalid: Setting "format" is not valid: "foo" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem".'
    );
  });

  it("Should not throw an error when a valid config object is provided", function () {
    const config = { "class-style": [true, { format: "camel" }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.not.throw();
  });

  it("Should not report any error for correctly formatted class", async function () {
    const linter = createLinter({
      "class-style": [true, "lowercase"]
    });
    const html = '<div class="foo"></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should deal with multiple spaces between classes", async function () {
    const linter = createLinter({
      "class-style": [true, "lowercase"]
    });
    const html = '<div class="foo  bar"></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  describe("'lowercase' format", function () {
    it("Should not report an error for classes with valid format", async function () {
      const linter = createLinter({
        "class-style": [true, "lowercase"]
      });
      const html = '<div class="foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function () {
      const linter = createLinter({
        "class-style": [true, "lowercase"]
      });
      const html = '<div class="FOO bar-foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("'dash' format", function () {
    it("Should not report an error for classes with valid format", async function () {
      const linter = createLinter({
        "class-style": [true, "dash"]
      });
      const html = '<div class="bar-foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function () {
      const linter = createLinter({
        "class-style": [true, "dash"]
      });
      const html = '<div class="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'underscore' format", function () {
    it("Should not report an error for classes with valid format", async function () {
      const linter = createLinter({
        "class-style": [true, "underscore"]
      });
      const html = '<div class="bar_foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function () {
      const linter = createLinter({
        "class-style": [true, "underscore"]
      });
      const html = '<div class="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'BEM' format", function () {
    it("Should not report an error for classes with valid format", async function () {
      const linter = createLinter({
        "class-style": [true, "bem"]
      });
      const html = '<div class="block__element block--modifier"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function () {
      const linter = createLinter({
        "class-style": [true, "bem"]
      });
      const html = '<div class="block--modifier--modifier block__element__element"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("'regexp' format", function () {
    it("Should not report an error for classes with valid format", async function () {
      const linter = createLinter({
        "class-style": [true, /^foo-\d+$/]
      });
      const html = '<div class="foo-1"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for classes with invalid format", async function () {
      const linter = createLinter({
        "class-style": [true, /^foo-\d+$/]
      });
      const html = '<div class="bar-2"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should fallback to `id-class-style` if `class-style` is false", async function () {
    const linter = createLinter({
      "class-style": false,
      "id-class-style": [true, "lowercase"]
    });
    const html = '<div class="FOO bar-foo"></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(3); // 1 for rule deprecation and 2 for rules issues
    expect(issues[0].severity).to.equal("warning");
    expect(issues[0].code).to.equal("DEPRECATED_RULE");
    expect(issues[1].code).to.equal("E011");
    expect(issues[1].code).to.equal("E011");
  });

  it("Should not fallback to `id-class-style` if `class-style` is set to `none`", async function () {
    const linter = createLinter({
      "class-style": [true, "none"],
      "id-class-style": [true, "lowercase"]
    });
    const html = '<div class="FOO bar-foo"></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1); // For rule deprecation
    expect(issues[0].severity).to.equal("warning");
    expect(issues[0].code).to.equal("DEPRECATED_RULE");
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

  it("Rule should not fail if class attribute has no value", function () {
    const linter = createLinter({
      "class-style": [true, "dash"]
    });
    const html = `
      <div class></div>
    `;

    expect(() => linter.lint(html)).to.not.throw();
  });
});
