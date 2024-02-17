import linthtml from "../../../index.js";
import { presets } from "../../../presets/index.js";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config.js";

describe("legacy linter | html-req-lang", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report any error when html tag as a none empty lang attribute", async () => {
    const linter = createLinter({ "html-req-lang": true });
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        </html>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error when html tag does not have a lang attribute", async () => {
    const linter = createLinter({ "html-req-lang": true });
    const html = `
        <!DOCTYPE html>
        <html>
        </html>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });
});

describe("html-req-lang", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error when html tag as a none empty lang attribute", async () => {
    const linter = createLinter({ "html-req-lang": true });
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        </html>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error when html tag does not have a lang attribute", async () => {
    const linter = createLinter({ "html-req-lang": true });
    const html = `
        <!DOCTYPE html>
        <html>
        </html>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });
});
