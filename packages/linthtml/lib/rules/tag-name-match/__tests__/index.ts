import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | tag-name-match", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report an error for matching open/close tags", async () => {
    const linter = createLinter({ "tag-name-match": true });
    const html = "<body></body><Div></Div>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it(
    "Should report an error for not matching open/close tags (different case)",
    async () => {
      const linter = createLinter({ "tag-name-match": true });
      const html = "<body></Body>";
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );
});

describe("tag-name-match", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report an error for matching open/close tags", async () => {
    const linter = createLinter({ "tag-name-match": true });
    const html = "<body></body><Div></Div>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it(
    "Should report an error for not matching open/close tags (different case)",
    async () => {
      const linter = createLinter({ "tag-name-match": true });
      const html = "<body></Body>";
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );
});
