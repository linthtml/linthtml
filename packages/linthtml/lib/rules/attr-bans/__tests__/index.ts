import { LegacyLinterConfig, RuleConfig } from "../../../read-config";
import linthtml from "../../../index";
import { presets } from "../../../presets";

describe("legacy linter | attr-bans", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report an error for a tag named 'style'", async () => {
    const linter = createLinter({ "attr-bans": ["style"] });
    const html = "<body><style>hello</style></body>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report anything when disabled", async () => {
    const linter = createLinter({ "attr-bans": false });
    const html = '<button style="color: red;"></button>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should accept a single string as option", async () => {
    const linter = createLinter({ "attr-bans": "style" });
    const html = '<button style="color: red;"></button>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Banned attributes should be case insensitive", async () => {
    const linter = createLinter({ "attr-bans": ["ban0", "bAN1"] });
    const html = "<body ban0 ban1>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should accept regexes as config", async () => {
    const linter = createLinter({ "attr-bans": [/on\w+/i] });
    const html = "<div onClick='' onfocus='' noop=''></div>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should throw an error for an invalid config", async () => {
    const linter = createLinter({ "attr-bans": true });
    const html = '<button style="color: red;"></button>';
    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "attr-bans" is invalid: Expected string, RegExp or (string|RegExp)[] got boolean'
    );
  });

  it(
    "Should throw an error if not given a list of strings as config",
    () => {
      const linter = createLinter({ "attr-bans": ["string", true] });
      const html = '<button style="color: red;"></button>';
      expect(() => linter.lint(html)).toThrow(
        'Configuration for rule "attr-bans" is invalid: Expected string, RegExp or (string|RegExp)[] got boolean[]'
      );
    }
  );

  it(
    "Should report an error when the 'style' attribute is present",
    async () => {
      const linter = createLinter({ "attr-bans": ["style"] });
      const html = '<button style="color: red;"></button>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );
});
describe("attr-bans", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }

  it("Should not report an error for a tag named 'style'", async () => {
    const linter = createLinter({ "attr-bans": [true, "style"] });
    const html = "<body><style>hello</style></body>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report anything when disabled", async () => {
    const linter = createLinter({
      "attr-bans": false
    });
    const html = '<button style="color: red;"></button>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should accept a single string as option", async () => {
    const linter = createLinter({
      "attr-bans": [true, "style"]
    });
    const html = '<button style="color: red;"></button>';
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Banned attributes should be case insensitive", async () => {
    const linter = createLinter({
      "attr-bans": [true, ["ban0", "bAN1"]]
    });
    const html = "<body ban0 ban1>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should accept regexes as config", async () => {
    const linter = createLinter({
      "attr-bans": [true, [/on\w+/i]]
    });
    const html = "<div onClick='' onfocus='' noop=''></div>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should throw an error for an invalid config", async () => {
    const config = {
      "attr-bans": [true, true] as [boolean, boolean]
    };
    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "attr-bans" is invalid: Expected string, RegExp or (string|RegExp)[] got boolean'
    );
  });

  it(
    "Should throw an error if not given a list of strings as config",
    () => {
      const config = {
        "attr-bans": [true, ["string", true]] as [boolean, unknown]
      };
      expect(() => createLinter(config)).toThrow(
        'Configuration for rule "attr-bans" is invalid: Expected string, RegExp or (string|RegExp)[] got boolean[]'
      );
    }
  );

  it(
    "Should report an error when the 'style' attribute is present",
    async () => {
      const linter = createLinter({
        "attr-bans": [true, "style"]
      });
      const html = '<button style="color: red;"></button>';
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );
});
