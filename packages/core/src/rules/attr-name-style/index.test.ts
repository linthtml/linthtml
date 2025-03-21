import { expect } from "chai";
import linthtml from "../../index.js";
import { presets } from "../../presets/index.js";
import type { LegacyLinterConfig, RuleConfig } from "../../read-config.js";

describe("legacy linter | attr-name-style", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }

  it('Should ignore attributes matching "raw-ignore-text"', async function () {
    const linter = createLinter({
      "attr-name-style": "dash",
      "raw-ignore-regex": "{{.*?}}"
    });
    const html = "<div an-attribute {{ logic }} another-attribute {{ end }}></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report anything for correctly styled attribute names", async function () {
    const linter = createLinter({ "attr-name-style": "lowercase" });
    const html = '<div abc="" fowj0wo3=""></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should ignore ignored attributes using rule option", async function () {
    const linter = createLinter({
      "attr-name-style": { format: "dash", ignore: "xlink:href" }
    });
    const html = '<xml xlink:href=""></xml>';
    const issues = await linter.lint(html);
    expect(issues.filter((_) => _.code !== "DEPRECATED_RULE")).to.have.lengthOf(0);
  });

  it("Should ignore ignored attributes", async function () {
    const linter = createLinter({
      "attr-name-style": "dash",
      "attr-name-ignore-regex": "xlink:href"
    });
    const html = '<xml xlink:href=""></xml>';
    const issues = await linter.lint(html);
    expect(issues.filter((_) => _.code !== "DEPRECATED_RULE")).to.have.lengthOf(0);
  });

  it("Should not report anything when disabled", async function () {
    const linter = createLinter({ "attr-name-style": false });
    const html = '<div abc="" 2fOwj_0o-3=""></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error when an invalid config is passed", function () {
    const linter = createLinter({ "attr-name-style": ["camel"] });
    const html = '<button style="color: red;"></button>';
    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "attr-name-style" is invalid: Expected string or RegExp got object'
    );
  });

  it("Should throw an error when an invalid object config is passed", function () {
    const linter = createLinter({ "attr-name-style": { foo: "camel" } });
    const html = '<button style="color: red;"></button>';
    expect(() => linter.lint(html)).to.throw(
      'Object configuration for rule "attr-name-style" is invalid: key "foo" is not accepted, only keys "format" and "ignore" are.'
    );
  });

  it("Should throw an error when the value for the config key format is not valid", function () {
    const linter = createLinter({ "attr-name-style": { format: ["camel"] } });
    const html = '<button style="color: red;"></button>';
    expect(() => linter.lint(html)).to.throw(
      'Object configuration for rule "attr-name-style" is invalid: Setting "format" is not valid: Expected string or RegExp got object'
    );
  });

  it("Should throw an error when the value for the config key ignore is not valid", function () {
    const linter = createLinter({ "attr-name-style": { format: "camel", ignore: 1 } });
    const html = '<button style="color: red;"></button>';
    expect(() => linter.lint(html)).to.throw(
      'Object configuration for rule "attr-name-style" is invalid: Setting "ignore" is not valid: Expected string or RegExp got number'
    );
  });

  it("Should throw an error when the key 'format' is missing in the config object", function () {
    const linter = createLinter({ "attr-name-style": { ignore: 1 } });
    const html = '<button style="color: red;"></button>';
    expect(() => linter.lint(html)).to.throw(
      'Object configuration for rule "attr-name-style" is invalid: Setting "format" is missing'
    );
  });

  it("Should throw an error when an invalid format is passed within the object config", function () {
    const linter = createLinter({ "attr-name-style": { format: "foo" } });
    const html = '<button style="color: red;"></button>';
    expect(() => linter.lint(html)).to.throw(
      'Object configuration for rule "attr-name-style" is invalid: Setting "format" is not valid: "foo" is not accepted. Accepted values are "lowercase", "underscore", "dash", "camel" and "bem".'
    );
  });

  it("Should throw an error when an invalid object config key is passed", function () {
    const linter = createLinter({ "attr-name-style": { foo: "camel" } });
    const html = '<button style="color: red;"></button>';
    expect(() => linter.lint(html)).to.throw(
      'Object configuration for rule "attr-name-style" is invalid: key "foo" is not accepted, only keys "format" and "ignore" are.'
    );
  });

  it("Should not throw an error when config object is provided", function () {
    const linter = createLinter({ "attr-name-style": { format: "camel" } });
    const html = '<button style="color: red;"></button>';
    expect(() => linter.lint(html)).to.not.throw();
  });

  describe("'lowercase' format", function () {
    it("Should not report an error for attributes with valid format", async function () {
      const linter = createLinter({ "attr-name-style": "lowercase" });
      const html = '<div foo=""></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for attributes with invalid format", async function () {
      const linter = createLinter({ "attr-name-style": "lowercase" });
      const html = '<div FooBar="" foo-bar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("'dash' format", function () {
    it("Should not report an error for attributes with valid format", async function () {
      const linter = createLinter({ "attr-name-style": "dash" });
      const html = '<div foo-bar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for attributes with invalid format", async function () {
      const linter = createLinter({ "attr-name-style": "dash" });
      const html = '<div FooBar="" foo_bar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("'regexp' format", function () {
    it("Should not report an error for attributes with valid format", async function () {
      const linter = createLinter({ "attr-name-style": /^[0-9a-o]+$/ });
      const html = '<div foo=""></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for attributes with invalid format", async function () {
      const linter = createLinter({ "attr-name-style": /^[0-9a-o]+$/ });
      const html = "<div bar></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'camel' format", function () {
    it("Should not report an error for attributes with valid format", async function () {
      const linter = createLinter({ "attr-name-style": "camel" });
      const html = '<div FooBar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for attributes with invalid format", async function () {
      const linter = createLinter({ "attr-name-style": "camel" });
      const html = "<div foo-bar></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });
});

describe("attr-name-style", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }

  it('Should ignore attributes matching "raw-ignore-text"', async function () {
    const linter = linthtml.fromConfig({
      "raw-ignore-regex": "{{.*?}}",
      rules: {
        "attr-name-style": [true, "dash"]
      }
    });
    const html = "<div an-attribute {{ logic }} another-attribute {{ end }}></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report anything for correctly styled attribute names", async function () {
    const linter = createLinter({
      "attr-name-style": [true, "lowercase"]
    });
    const html = '<div abc="" fowj0wo3=""></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should ignore ignored attributes", async function () {
    const linter = linthtml.fromConfig({
      "attr-name-ignore-regex": "xlink:href",
      rules: {
        "attr-name-style": [true, "dash"]
      }
    });
    const html = '<xml xlink:href=""></xml>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should ignore ignored attributes using rule option", async function () {
    const linter = linthtml.fromConfig({
      rules: {
        "attr-name-style": [true, { format: "dash", ignore: "xlink:href" }]
      }
    });
    const html = '<xml xlink:href=""></xml>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report anything when disabled", async function () {
    const linter = createLinter({
      "attr-name-style": false
    });
    const html = '<div abc="" 2fOwj_0o-3=""></div>';
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error when an invalid config is passed", function () {
    const config = {
      "attr-name-style": [true, ["camel"]] as [boolean, unknown]
    };
    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "attr-name-style" is invalid: Expected string or RegExp got object'
    );
  });

  it("Should throw an error when an invalid object config is passed", function () {
    const config = { "attr-name-style": [true, { foo: "camel" }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "attr-name-style" is invalid: key "foo" is not accepted, only keys "format" and "ignore" are.'
    );
  });

  it("Should throw an error when the value for the config key format is not valid", function () {
    const config = { "attr-name-style": [true, { format: ["camel"] }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "attr-name-style" is invalid: Setting "format" is not valid: Expected string or RegExp got object'
    );
  });

  it("Should throw an error when the value for the config key ignore is not valid", function () {
    const config = { "attr-name-style": [true, { format: "camel", ignore: 1 }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "attr-name-style" is invalid: Setting "ignore" is not valid: Expected string or RegExp got number'
    );
  });

  it("Should throw an error when the key 'format' is missing in the config object", function () {
    const config = { "attr-name-style": [true, { ignore: 1 }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "attr-name-style" is invalid: Setting "format" is missing'
    );
  });

  it("Should throw an error when an invalid format is passed within the object config", function () {
    const config = { "attr-name-style": [true, { format: "foo" }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "attr-name-style" is invalid: Setting "format" is not valid: "foo" is not accepted. Accepted values are "lowercase", "underscore", "dash", "camel" and "bem".'
    );
  });

  it("Should throw an error when an invalid object config key is passed", function () {
    const config = { "attr-name-style": [true, { foo: "camel" }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.throw(
      'Object configuration for rule "attr-name-style" is invalid: key "foo" is not accepted, only keys "format" and "ignore" are.'
    );
  });

  it("Should not throw an error when config object is provided", function () {
    const config = { "attr-name-style": [true, { format: "camel" }] } satisfies Record<string, RuleConfig>;

    expect(() => createLinter(config)).to.not.throw();
  });

  describe("'lowercase' format", function () {
    it("Should not report an error for attributes with valid format", async function () {
      const linter = createLinter({
        "attr-name-style": [true, "lowercase"]
      });
      const html = '<div foo=""></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for attributes with invalid format", async function () {
      const linter = createLinter({
        "attr-name-style": [true, "lowercase"]
      });
      const html = '<div FooBar="" foo-bar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("'dash' format", function () {
    it("Should not report an error for attributes with valid format", async function () {
      const linter = createLinter({
        "attr-name-style": [true, "dash"]
      });
      const html = '<div foo-bar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for attributes with invalid format", async function () {
      const linter = createLinter({
        "attr-name-style": [true, "dash"]
      });
      const html = '<div FooBar="" foo_bar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("'regexp' format", function () {
    it("Should not report an error for attributes with valid format", async function () {
      const linter = createLinter({
        "attr-name-style": [true, /^[0-9a-o]+$/]
      });
      const html = '<div foo=""></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for attributes with invalid format", async function () {
      const linter = createLinter({
        "attr-name-style": [true, /^[0-9a-o]+$/]
      });
      const html = "<div bar></div>";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("'camel' format", function () {
    it("Should not report an error for attributes with valid format", async function () {
      const linter = createLinter({
        "attr-name-style": [true, "camel"]
      });
      const html = '<div FooBar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for attributes with invalid format", async function () {
      const linter = createLinter({
        "attr-name-style": [true, "camel"]
      });
      const html = "<div foo-bar></div>";
      const issues = await linter.lint(html);
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
