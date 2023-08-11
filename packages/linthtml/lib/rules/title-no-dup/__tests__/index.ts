import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | title-no-dup", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it(
    "Should not report an error when title is not duplicated",
    async () => {
      const linter = createLinter({ "title-no-dup": true });
      const html = "<head><title>Title!</title></head>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it("Should report an error when title is duplicated", async () => {
    const linter = createLinter({ "title-no-dup": true });
    const html = "<head><title>Title!</title><title>Title!</title></head>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should catch multiple duplicates", async () => {
    const linter = createLinter({ "title-no-dup": true });
    const html = "<head><title>Title!</title><title>Title!</title><title>Title!</title><title>Title!</title></head>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(3);
  });
});

describe("title-no-dup", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it(
    "Should not report an error when title is not duplicated",
    async () => {
      const linter = createLinter({ "title-no-dup": true });
      const html = "<head><title>Title!</title></head>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it("Should report an error when title is duplicated", async () => {
    const linter = createLinter({ "title-no-dup": true });
    const html = "<head><title>Title!</title><title>Title!</title></head>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should catch multiple duplicates", async () => {
    const linter = createLinter({ "title-no-dup": true });
    const html = "<head><title>Title!</title><title>Title!</title><title>Title!</title><title>Title!</title></head>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(3);
  });
});
