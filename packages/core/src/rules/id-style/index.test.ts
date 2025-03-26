import { expect } from "chai";
import linthtml from "../../index.js";
import { presets } from "../../presets/index.js";
import type { LegacyLinterConfig, RuleConfig } from "../../read-config.js";

describe("legacy linter | id-style", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  // it("Should ignore id matching \"raw-ignore-text\"", async function() {
  //   const linter = createLinter({
  //     "id-style": "dash",
  //     "raw-ignore-regex": "{{.*?}}"
  //   });
  //   const html = "<div id=\"{{ if }} foo {{ else }} bar {{ end }}\"></div>";
  //   const issues = await linter.lint(html);
  //   expect(issues).to.have.lengthOf(0);
  // });

  it("Should throw an error if `id-class-ignore-regex` is empty", function () {
    const linter = createLinter({
      "id-style": "dash",
      "id-class-ignore-regex": ""
    });
    const html = '<div id="bar-2"></div>';

    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "id-class-ignore-regex" is invalid: You provide an empty string value'
    );
  });

  it("should throw an error if rule config is empty", function () {
    const linter = createLinter({ "id-style": "" });

    expect(() => linter.lint("")).to.throw(
      'Configuration for rule "id-style" is invalid: "" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem"'
    );
  });

  it("should throw an error if rule config is provided with an invalid format", function () {
    const linter = createLinter({ "id-style": "foo" });

    expect(() => linter.lint("")).to.throw(
      'Configuration for rule "id-style" is invalid: "foo" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem"'
    );
  });

  it("should throw an error if object config as invalid key", function () {
    const linter = createLinter({ "id-style": { foo: "" } });

    expect(() => linter.lint("")).to.throw(
      'Object configuration for rule "id-style" is invalid: key "foo" is not accepted, only "format", "ignore" are.'
    );
  });

  it("Should throw an error when the value for the config key format is not valid", function () {
    const linter = createLinter({ "id-style": { format: ["camel"] } });

    expect(() => linter.lint("")).to.throw(
      'Object configuration for rule "id-style" is invalid: Setting "format" is not valid: Expected string or RegExp got array'
    );
  });

  it("Should throw an error when the value for the config key ignore is not valid", function () {
    const linter = createLinter({ "id-style": { format: "camel", ignore: 1 } });

    expect(() => linter.lint("")).to.throw(
      'Object configuration for rule "id-style" is invalid: Setting "ignore" is not valid: Expected string or RegExp got number'
    );
  });

  it("Should throw an error when the key 'format' is missing in the config object", function () {
    const linter = createLinter({ "id-style": { ignore: "" } });

    expect(() => linter.lint("")).to.throw(
      'Object configuration for rule "id-style" is invalid: Setting "format" is missing'
    );
  });

  it("Should throw an error when an invalid format is passed within the object config", function () {
    const linter = createLinter({ "id-style": { format: "foo" } });

    expect(() => linter.lint("")).to.throw(
      'Object configuration for rule "id-style" is invalid: Setting "format" is not valid: "foo" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem".'
    );
  });

  it("Should not throw an error when a valid config object is provided", function () {
    const linter = createLinter({ "id-style": { format: "camel" } });

    expect(() => linter.lint("")).to.not.throw();
  });

  it("Should not report any error for correctly formatted id", async function () {
    const linter = createLinter({ "id-style": "lowercase" });
    const html = '<div id="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  describe("'lowercase' format", function () {
    it("Should not report an error for ids with valid format", async function () {
      const linter = createLinter({ "id-style": { format: "lowercase" } });
      const html = '<div id="foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for ids with invalid format", async function () {
      const linter = createLinter({ "id-style": "lowercase" });
      const html = '<div id="bar-foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'dash' format", function () {
    it("Should not report an error for ids with valid format", async function () {
      const linter = createLinter({ "id-style": "dash" });
      const html = '<div id="bar-foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for ids with invalid format", async function () {
      const linter = createLinter({ "id-style": "dash" });
      const html = '<div id="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'underscore' format", function () {
    it("Should not report an error for ids with valid format", async function () {
      const linter = createLinter({ "id-style": "underscore" });
      const html = '<div id="bar_foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for ids with invalid format", async function () {
      const linter = createLinter({ "id-style": "underscore" });
      const html = '<div id="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'BEM' format", function () {
    it("Should not report an error for ids with valid format", async function () {
      const linter = createLinter({ "id-style": "bem" });
      const html = '<div id="block__element"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for ids with invalid format", async function () {
      const linter = createLinter({ "id-style": "bem" });
      const html = '<div id="block--modifier--modifier"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'regexp' format", function () {
    it("Should not report an error for ids with valid format", async function () {
      const linter = createLinter({ "id-style": /^foo-\d+$/ });
      const html = '<div id="foo-1"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for ids with invalid format", async function () {
      const linter = createLinter({ "id-style": /^foo-\d+$/ });
      const html = '<div id="bar-2"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should fallback to `id-class-style` if `id-style` is false", async function () {
    const linter = createLinter({
      "id-style": false,
      "id-class-style": "lowercase"
    });
    const html = '<div id="FOO"></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2); // 1 for rule deprecation and 1 for rule issue
    expect(issues[0].severity).to.equal("warning");
    expect(issues[0].code).to.equal("DEPRECATED_RULE");
    expect(issues[1].code).to.equal("E011");
    expect(issues[1].code).to.equal("E011");
  });

  it("Should not fallback to `id-class-style` if `id-style` is set to `none`", async function () {
    const linter = createLinter({
      "id-style": "none",
      "id-class-style": "lowercase"
    });
    const html = '<div id="FOO"></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].severity).to.equal("warning");
    expect(issues[0].code).to.equal("DEPRECATED_RULE");
  });

  it("Rule should not fail if id attribute has no value", function () {
    const linter = createLinter({ "id-style": "dash" });
    const html = `
      <div id></div>
    `;

    expect(() => linter.lint(html)).to.not.throw();
  });
});

describe("id-style", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  // TOFIX
  // it("Should ignore id matching \"raw-ignore-text\"", async function() {
  //   const linter = linthtml.fromConfig({
  //     "raw-ignore-regex": "{{.*?}}",
  //     rules: {
  //       "id-style": [
  //         true,
  //         "dash"
  //       ]
  //     }
  //   });
  //   const html = "<div id=\"{{ if }} foo {{ else }} bar {{ end }}\"></div>";
  //   const issues = await linter.lint(html);
  //   expect(issues).to.have.lengthOf(0);
  // });

  it("should throw an error if rule config is empty", function () {
    const config = {
      "id-style": [true, ""] as [boolean, unknown]
    };

    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "id-style" is invalid: "" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem"'
    );
  });

  it("should throw an error if rule config is provided with an invalid format", function () {
    const config = {
      "id-style": [true, "foo"] as [boolean, unknown]
    };

    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "id-style" is invalid: "foo" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem"'
    );
  });

  it("should throw an error if object config as invalid key", function () {
    const config = { "id-style": [true, { foo: "" }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "id-style" is invalid: key "foo" is not accepted, only "format", "ignore" are.'
    );
  });

  it("Should throw an error when the value for the config key format is not valid", function () {
    const config = { "id-style": [true, { format: ["camel"] }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "id-style" is invalid: Setting "format" is not valid: Expected string or RegExp got array'
    );
  });

  it("Should throw an error when the value for the config key ignore is not valid", function () {
    const config = { "id-style": [true, { format: "camel", ignore: 1 }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "id-style" is invalid: Setting "ignore" is not valid: Expected string or RegExp got number'
    );
  });

  it("Should throw an error when the key 'format' is missing in the config object", function () {
    const config = { "id-style": [true, { ignore: "" }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "id-style" is invalid: Setting "format" is missing'
    );
  });

  it("Should throw an error when an invalid format is passed within the object config", function () {
    const config = { "id-style": [true, { format: "foo" }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "id-style" is invalid: Setting "format" is not valid: "foo" is not accepted. Accepted values are "none", "lowercase", "underscore", "dash", "camel" and "bem".'
    );
  });

  it("Should not throw an error when a valid config object is provided", function () {
    const config = { "id-style": [true, { format: "camel" }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.not.throw();
  });

  it("Should not report any error for correctly formatted id", async function () {
    const linter = createLinter({
      "id-style": [true, "lowercase"]
    });
    const html = '<div id="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  describe("'lowercase' format", function () {
    it("Should not report an error for ids with valid format", async function () {
      const linter = createLinter({
        "id-style": [true, { format: "lowercase" }]
      });
      const html = '<div id="foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for ids with invalid format", async function () {
      const linter = createLinter({
        "id-style": [true, "lowercase"]
      });
      const html = '<div id="bar-foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'dash' format", function () {
    it("Should not report an error for ids with valid format", async function () {
      const linter = createLinter({
        "id-style": [true, "dash"]
      });
      const html = '<div id="bar-foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for ids with invalid format", async function () {
      const linter = createLinter({
        "id-style": [true, "dash"]
      });
      const html = '<div id="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'underscore' format", function () {
    it("Should not report an error for ids with valid format", async function () {
      const linter = createLinter({
        "id-style": [true, "underscore"]
      });
      const html = '<div id="bar_foo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for ids with invalid format", async function () {
      const linter = createLinter({
        "id-style": [true, "underscore"]
      });
      const html = '<div id="BarFoo"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'BEM' format", function () {
    it("Should not report an error for ids with valid format", async function () {
      const linter = createLinter({
        "id-style": [true, "bem"]
      });
      const html = '<div id="block__element"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for ids with invalid format", async function () {
      const linter = createLinter({
        "id-style": [true, "bem"]
      });
      const html = '<div id="block--modifier--modifier"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'regexp' format", function () {
    it("Should not report an error for ids with valid format", async function () {
      const linter = createLinter({
        "id-style": [true, /^foo-\d+$/]
      });
      const html = '<div id="foo-1"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for ids with invalid format", async function () {
      const linter = createLinter({
        "id-style": [true, /^foo-\d+$/]
      });
      const html = '<div id="bar-2"></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Rule should not fail if id attribute has no value", function () {
    const linter = createLinter({
      "id-style": [true, "dash"]
    });
    const html = `
      <div id></div>
    `;

    expect(() => linter.lint(html)).to.not.throw();
  });

  it("Should fallback to `id-class-style` if `id-style` is false", async function () {
    const linter = createLinter({
      "id-style": false,
      "id-class-style": [true, "lowercase"]
    });
    const html = '<div id="FOO"></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2); // 1 for rule deprecation and 1 for rule issue
    expect(issues[0].severity).to.equal("warning");
    expect(issues[0].code).to.equal("DEPRECATED_RULE");
    expect(issues[1].code).to.equal("E011");
    expect(issues[1].code).to.equal("E011");
  });

  it("Should not fallback to `id-class-style` if `id-style` is set to `none`", async function () {
    const linter = createLinter({
      "id-style": [true, "none"],
      "id-class-style": [true, "lowercase"]
    });
    const html = '<div id="FOO"></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].severity).to.equal("warning");
    expect(issues[0].code).to.equal("DEPRECATED_RULE");
  });
});
