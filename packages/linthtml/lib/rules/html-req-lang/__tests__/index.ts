import { expect } from "chai";
import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | html-req-lang", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report any error when html tag as a none empty lang attribute", async function () {
    const linter = createLinter({ "html-req-lang": true });
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when html tag does not have a lang attribute", async function () {
    const linter = createLinter({ "html-req-lang": true });
    const html = `
      <!DOCTYPE html>
      <html>
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
});

describe("html-req-lang", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error when html tag as a none empty lang attribute", async function () {
    const linter = createLinter({ "html-req-lang": true });
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when html tag does not have a lang attribute", async function () {
    const linter = createLinter({ "html-req-lang": true });
    const html = `
      <!DOCTYPE html>
      <html>
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
});
