import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | attr-name-style", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it('Should ignore attributes matching "raw-ignore-text"', async () => {
    const linter = createLinter({
      "attr-name-style": "dash",
      "raw-ignore-regex": "{{.*?}}"
    });
    const html = "<div an-attribute {{ logic }} another-attribute {{ end }}></div>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report anything for correctly styled attribute names", async () => {
    const linter = createLinter({ "attr-name-style": "lowercase" });
    const html = '<div abc="" fowj0wo3=""></div>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should ignore ignored attributes", async () => {
    const linter = createLinter({
      "attr-name-style": "dash",
      "attr-name-ignore-regex": "xlink:href"
    });
    const html = '<xml xlink:href=""></xml>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report anything when disabled", async () => {
    const linter = createLinter({ "attr-name-style": false });
    const html = '<div abc="" 2fOwj_0o-3=""></div>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  describe("'lowercase' format", () => {
    it("Should not report an error for attributes with valid format", async () => {
      const linter = createLinter({ "attr-name-style": "lowercase" });
      const html = '<div foo=""></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for attributes with invalid format", async () => {
      const linter = createLinter({ "attr-name-style": "lowercase" });
      const html = '<div FooBar="" foo-bar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });
  });
  describe("'dash' format", () => {
    it("Should not report an error for attributes with valid format", async () => {
      const linter = createLinter({ "attr-name-style": "dash" });
      const html = '<div foo-bar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for attributes with invalid format", async () => {
      const linter = createLinter({ "attr-name-style": "dash" });
      const html = '<div FooBar="" foo_bar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });
  });

  it("Should throw an error when an invalid config is passed", () => {
    const linter = createLinter({ "attr-name-style": ["camel"] });
    const html = '<button style="color: red;"></button>';
    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "attr-name-style" is invalid: Expected string or RegExp got object'
    );
  });

  describe("'regexp' format", () => {
    it("Should not report an error for attributes with valid format", async () => {
      const linter = createLinter({ "attr-name-style": /^[0-9a-o]+$/ });
      const html = '<div foo=""></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for attributes with invalid format", async () => {
      const linter = createLinter({ "attr-name-style": /^[0-9a-o]+$/ });
      const html = "<div bar></div>";
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });
  describe("'camel' format", () => {
    it("Should not report an error for attributes with valid format", async () => {
      const linter = createLinter({ "attr-name-style": "camel" });
      const html = '<div FooBar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for attributes with invalid format", async () => {
      const linter = createLinter({ "attr-name-style": "camel" });
      const html = "<div foo-bar></div>";
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });
});
describe("attr-name-style", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }

  it('Should ignore attributes matching "raw-ignore-text"', async () => {
    const linter = linthtml.fromConfig({
      "raw-ignore-regex": "{{.*?}}",
      rules: {
        "attr-name-style": [true, "dash"]
      }
    });
    const html = "<div an-attribute {{ logic }} another-attribute {{ end }}></div>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report anything for correctly styled attribute names", async () => {
    const linter = createLinter({
      "attr-name-style": [true, "lowercase"]
    });
    const html = '<div abc="" fowj0wo3=""></div>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should ignore ignored attributes", async () => {
    const linter = linthtml.fromConfig({
      "attr-name-ignore-regex": "xlink:href",
      rules: {
        "attr-name-style": [true, "dash"]
      }
    });
    const html = '<xml xlink:href=""></xml>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report anything when disabled", async () => {
    const linter = createLinter({
      "attr-name-style": false
    });
    const html = '<div abc="" 2fOwj_0o-3=""></div>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  describe("'lowercase' format", () => {
    it("Should not report an error for attributes with valid format", async () => {
      const linter = createLinter({
        "attr-name-style": [true, "lowercase"]
      });
      const html = '<div foo=""></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for attributes with invalid format", async () => {
      const linter = createLinter({
        "attr-name-style": [true, "lowercase"]
      });
      const html = '<div FooBar="" foo-bar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });
  });
  describe("'dash' format", () => {
    it("Should not report an error for attributes with valid format", async () => {
      const linter = createLinter({
        "attr-name-style": [true, "dash"]
      });
      const html = '<div foo-bar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for attributes with invalid format", async () => {
      const linter = createLinter({
        "attr-name-style": [true, "dash"]
      });
      const html = '<div FooBar="" foo_bar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });
  });

  it("Should throw an error when an invalid config is passed", () => {
    const config = {
      "attr-name-style": [true, ["camel"]] as [boolean, unknown]
    };
    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "attr-name-style" is invalid: Expected string or RegExp got object'
    );
  });

  describe("'regexp' format", () => {
    it("Should not report an error for attributes with valid format", async () => {
      const linter = createLinter({
        "attr-name-style": [true, /^[0-9a-o]+$/]
      });
      const html = '<div foo=""></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for attributes with invalid format", async () => {
      const linter = createLinter({
        "attr-name-style": [true, /^[0-9a-o]+$/]
      });
      const html = "<div bar></div>";
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });
  describe("'camel' format", () => {
    it("Should not report an error for attributes with valid format", async () => {
      const linter = createLinter({
        "attr-name-style": [true, "camel"]
      });
      const html = '<div FooBar=""></div>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for attributes with invalid format", async () => {
      const linter = createLinter({
        "attr-name-style": [true, "camel"]
      });
      const html = "<div foo-bar></div>";
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
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
