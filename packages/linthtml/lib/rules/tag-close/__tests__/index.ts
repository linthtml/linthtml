import linthtml from "../../../index.js";
import { presets } from "../../../presets/index.js";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config.js";

describe("legacy linter | tag-close", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }

  it("Should report an error for not matching open/close tags", async () => {
    const linter = createLinter({ "tag-close": true });
    const html = "<body></div>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report an error per none matching open/close tags", async () => {
    const linter = createLinter({ "tag-close": true });
    const html = "<body><p></span></div>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should not report an error for self closing tags", async () => {
    const linter = createLinter({ "tag-close": true });
    const html = "<br/><br>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report an error for unicode chars", async () => {
    const linter = createLinter({ "tag-close": true });
    const html = "<span>&#8599;</span>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});

describe("tag-close", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }

  it("Should report an error for not matching open/close tags", async () => {
    const linter = createLinter({ "tag-close": true });
    const html = "<body></div>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report an error per none matching open/close tags", async () => {
    const linter = createLinter({ "tag-close": true });
    const html = "<body><p></span></div>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should not report an error for self closing tags", async () => {
    const linter = createLinter({ "tag-close": true });
    const html = "<br/><br>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report an error for unicode chars", async () => {
    const linter = createLinter({ "tag-close": true });
    const html = "<span>&#8599;</span>";
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});
