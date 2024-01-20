import { LegacyLinterConfig, RuleConfig } from "../../../read-config.js";
import linthtml from "../../../index.js";
import { presets } from "../../../presets/index.js";

describe("legacy linter | attr-no-unsafe-char", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report error for safe char in attributes", async () => {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = '<div class="\u0040"></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report error for tabs/new_line in attributes", async () => {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = `
      <div class="
        foo
        bar">
      </div>`;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report error for unsafe char in attributes", async () => {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = '<div class="\u070f"></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should not report error for attribute without value", async () => {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = "<input aria-label='foo' required/>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});

describe("attr-no-unsafe-char", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report error for safe char in attributes", async () => {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = '<div class="\u0040"></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report error for tabs/new_line in attributes", async () => {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = `
      <div class="
        foo
        bar">
      </div>`;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report error for unsafe char in attributes", async () => {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = '<div class="\u070f"></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should not report error for attribute without value", async () => {
    const linter = createLinter({ "attr-no-unsafe-char": true });
    const html = "<input aria-label='foo' required/>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});
// \u0000 not accepted
