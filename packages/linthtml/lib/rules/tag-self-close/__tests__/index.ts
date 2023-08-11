import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | tag-self-close", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }

  it(
    'Should report an error for not closed self closed tags when "tag-self-close" is set to "always"',
    async () => {
      const linter = createLinter({ "tag-self-close": "always" });
      const html = "<img>";
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it(
    'Should not report an error for closed self closed tags when "tag-self-close" is set to "always"',
    async () => {
      const linter = createLinter({ "tag-self-close": "always" });
      const html = "<img/>";
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it(
    'Should report an error for closed self closed tags when "tag-self-close" is set to "never"',
    async () => {
      const linter = createLinter({ "tag-self-close": "never" });
      const html = "<img>";
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it(
    'Should not report an error for not closed self closed tags when "tag-self-close" is set to "never"',
    async () => {
      const linter = createLinter({ "tag-self-close": "never" });
      const html = "<img/>";
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it("Should throw an error for an invalid config", () => {
    const linter = createLinter({ "tag-self-close": true });
    const html = '<button"></button>';
    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "tag-self-close" is invalid: Expected string got boolean'
    );
  });

  it("Should throw an error if not given a list of strings as config", () => {
    const linter = createLinter({ "tag-self-close": "foo" });
    const html = "<button></button>";
    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "tag-self-close" is invalid: "foo" is not accepted. Accepted values are "always" and "never".'
    );
  });
});

describe("tag-self-close", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }

  it(
    'Should report an error for not closed self closed tags when "tag-self-close" is set to "always"',
    async () => {
      const linter = createLinter({
        "tag-self-close": [true, "always"]
      });
      const html = "<img>";
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it(
    'Should not report an error for closed self closed tags when "tag-self-close" is set to "always"',
    async () => {
      const linter = createLinter({
        "tag-self-close": [true, "always"]
      });
      const html = "<img/>";
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it(
    'Should report an error for closed self closed tags when "tag-self-close" is set to "never"',
    async () => {
      const linter = createLinter({
        "tag-self-close": [true, "never"]
      });
      const html = "<img>";
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it(
    'Should not report an error for not closed self closed tags when "tag-self-close" is set to "never"',
    async () => {
      const linter = createLinter({
        "tag-self-close": [true, "never"]
      });
      const html = "<img/>";
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it("Should throw an error for an invalid config", () => {
    const config = {
      "tag-self-close": [true, true] as [boolean, unknown]
    };
    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "tag-self-close" is invalid: Expected string got boolean'
    );
  });

  it("Should throw an error if not given a list of strings as config", () => {
    const config = {
      "tag-self-close": [true, "foo"] as [boolean, unknown]
    };
    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "tag-self-close" is invalid: "foo" is not accepted. Accepted values are "always" and "never".'
    );
  });
});
