import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | tag-name-lowercase", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should report an error when tags name are not lowercased", async () => {
    const linter = createLinter({ "tag-name-lowercase": true });
    const html = "<boDY></boDY>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report an error pers tags not lowercased", async () => {
    const linter = createLinter({ "tag-name-lowercase": true });
    const html = "<boDY><seCtion></section></boDY>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should not report an error when tags name are lowercased", async () => {
    const linter = createLinter({ "tag-name-lowercase": true });
    const html = "<body></body>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should ignore directive", async () => {
    const linter = createLinter({ "tag-name-lowercase": true });
    const html = "<!DOCTYPE html>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});

describe("tag-name-lowercase", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error when tags name are not lowercased", async () => {
    const linter = createLinter({ "tag-name-lowercase": true });
    const html = "<boDY></boDY>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report an error pers tags not lowercased", async () => {
    const linter = createLinter({ "tag-name-lowercase": true });
    const html = "<boDY><seCtion></section></boDY>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should not report an error when tags name are lowercased", async () => {
    const linter = createLinter({ "tag-name-lowercase": true });
    const html = "<body></body>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should ignore directive", async () => {
    const linter = createLinter({ "tag-name-lowercase": true });
    const html = "<!DOCTYPE html>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});
