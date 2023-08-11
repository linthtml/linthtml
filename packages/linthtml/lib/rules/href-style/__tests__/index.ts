import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | href-style", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  describe('"absolute" mode', () => {
    it("Should not report any error for absolute links", async () => {
      const linter = createLinter({ "href-style": "absolute" });
      const html = '<a href="http://www.google.com">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for relative links", async () => {
      const linter = createLinter({ "href-style": "absolute" });
      const html = '<a href="/foo">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });

    it("Should not report any error for empty links", async () => {
      const linter = createLinter({ "href-style": "absolute" });
      const html = "<a>A link</a>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should not report any error for fragment only links", async () => {
      const linter = createLinter({ "href-style": "absolute" });
      const html = '<a href="#bar">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });
  });
  describe('"relative" mode', () => {
    it("Should not report any error for relative links", async () => {
      const linter = createLinter({ "href-style": "relative" });
      const html = '<a href="/foo">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for absolute links", async () => {
      const linter = createLinter({ "href-style": "relative" });
      const html = '<a href="http://www.google.com">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });

    it("Should not report any error for empty links", async () => {
      const linter = createLinter({ "href-style": "relative" });
      const html = "<a>A link</a>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should not report any error for fragment only links", async () => {
      const linter = createLinter({ "href-style": "relative" });
      const html = '<a href="#bar">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });
  });

  it("Should throw an error for an invalid config", () => {
    const linter = createLinter({ "href-style": true });
    const html = "";
    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "href-style" is invalid: Expected string got boolean'
    );
  });

  it(
    "Should throw an error if not given a list of strings as config",
    () => {
      const linter = createLinter({ "href-style": "foo" });
      const html = "";
      expect(() => linter.lint(html)).toThrow(
        'Configuration for rule "href-style" is invalid: "foo" is not accepted. Accepted values are "absolute" and "relative".'
      );
    }
  );
});
describe("href-style", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  describe('"absolute" mode', () => {
    it("Should not report any error for absolute links", async () => {
      const linter = createLinter({
        "href-style": [true, "absolute"]
      });
      const html = '<a href="http://www.google.com">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for relative links", async () => {
      const linter = createLinter({
        "href-style": [true, "absolute"]
      });
      const html = '<a href="/foo">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });

    it("Should not report any error for empty links", async () => {
      const linter = createLinter({
        "href-style": [true, "absolute"]
      });
      const html = "<a>A link</a>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should not report any error for fragment only links", async () => {
      const linter = createLinter({
        "href-style": [true, "absolute"]
      });
      const html = '<a href="#bar">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });
  });
  describe('"relative" mode', () => {
    it("Should not report any error for relative links", async () => {
      const linter = createLinter({
        "href-style": [true, "relative"]
      });
      const html = '<a href="/foo">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error for absolute links", async () => {
      const linter = createLinter({
        "href-style": [true, "relative"]
      });
      const html = '<a href="http://www.google.com">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });

    it("Should not report any error for empty links", async () => {
      const linter = createLinter({
        "href-style": [true, "relative"]
      });
      const html = "<a>A link</a>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should not report any error for fragment only links", async () => {
      const linter = createLinter({
        "href-style": [true, "relative"]
      });
      const html = '<a href="#bar">A link</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });
  });

  it("Should throw an error for an invalid config", () => {
    const config = {
      "href-style": [true, true] as [boolean, unknown]
    };
    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "href-style" is invalid: Expected string got boolean'
    );
  });

  it(
    "Should throw an error if not given a list of strings as config",
    () => {
      const config = {
        "href-style": [true, "foo"] as [boolean, unknown]
      };
      expect(() => createLinter(config)).toThrow(
        'Configuration for rule "href-style" is invalid: "foo" is not accepted. Accepted values are "absolute" and "relative".'
      );
    }
  );
});
