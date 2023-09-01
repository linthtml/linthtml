import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | img-req-alt", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report any error for <img> with an alt value", async () => {
    const linter = createLinter({ "img-req-alt": true });
    const html = '<img src="cat.jpg" alt="A cat picture">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error for <img> without an alt value", async () => {
    const linter = createLinter({ "img-req-alt": true });
    const html = '<img src="cat.jpg">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report an error for <img> with an empty alt value", async () => {
    const linter = createLinter({ "img-req-alt": true });
    const html = '<img src="cat.jpg" alt="">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should check only <img>", async () => {
    const linter = createLinter({ "img-req-alt": true });
    const html = '<div alt="">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  describe('"allownull" option', () => {
    it("Should not report error for <img> with an empty alt value", async () => {
      const linter = createLinter({ "img-req-alt": "allownull" });
      const html = '<img src="cat.jpg" alt="">';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for <img> without an alt value", async () => {
      const linter = createLinter({ "img-req-alt": "allownull" });
      const html = '<img src="cat.jpg">';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  it("Should throw an error for invalid config (wrong type)", () => {
    const linter = createLinter({ "img-req-alt": 0 });
    const html = '<img src="cat.jpg">';

    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "img-req-alt" is invalid: Expected boolean got number'
    );
  });

  it("Should throw an error for invalid config (not valid string)", () => {
    const linter = createLinter({ "img-req-alt": "foo" });
    const html = '<img src="cat.jpg">';

    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "img-req-alt" is invalid: Only "allownull" is accepted as string value'
    );
  });
});

describe("img-req-alt", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error for <img> with an alt value", async () => {
    const linter = createLinter({ "img-req-alt": true });
    const html = '<img src="cat.jpg" alt="A cat picture">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error for <img> without an alt value", async () => {
    const linter = createLinter({ "img-req-alt": true });
    const html = '<img src="cat.jpg">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report an error for <img> with an empty alt value", async () => {
    const linter = createLinter({ "img-req-alt": true });
    const html = '<img src="cat.jpg" alt="">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should check only <img>", async () => {
    const linter = createLinter({ "img-req-alt": true });
    const html = '<div alt="">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  describe('"allownull" option', () => {
    it("Should not report error for <img> with an empty alt value", async () => {
      const linter = createLinter({
        "img-req-alt": [true, "allownull"]
      });
      const html = '<img src="cat.jpg" alt="">';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for <img> without an alt value", async () => {
      const linter = createLinter({
        "img-req-alt": [true, "allownull"]
      });
      const html = '<img src="cat.jpg">';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  it("Should throw an error for invalid config (wrong type)", () => {
    const config = {
      "img-req-alt": [true, 0] as [boolean, unknown]
    };
    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "img-req-alt" is invalid: Expected boolean got number'
    );
  });

  it("Should throw an error for invalid config (not valid string)", () => {
    const config = {
      "img-req-alt": [true, "foo"] as [boolean, unknown]
    };

    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "img-req-alt" is invalid: Only "allownull" is accepted as string value'
    );
  });
});
