import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | table-req-caption", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it('Should report an error when "<table>" does not have a "<caption>"', async () => {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table></table>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it('Should report an error when "<caption>" is not a child of "<table>"', async () => {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table><td><caption>Hello</caption></td></table>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it('Should report an error when "<caption>" is a sibling of "<table>"', async () => {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table></table><caption>Hello</caption>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it('Should report as many error as "<table>" without "<caption>"', async () => {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table></table><table></table>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it('Should not report any error for "<table>" with "<caption>"', async () => {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table><caption>Caption></table><table><td></td><td></td><caption>Caption</caption></table>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});

describe("table-req-caption", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it('Should report an error when "<table>" does not have a "<caption>"', async () => {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table></table>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it('Should report an error when "<caption>" is not a child of "<table>"', async () => {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table><td><caption>Hello</caption></td></table>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it('Should report an error when "<caption>" is a sibling of "<table>"', async () => {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table></table><caption>Hello</caption>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it('Should report as many error as "<table>" without "<caption>"', async () => {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table></table><table></table>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it('Should not report any error for "<table>" with "<caption>"', async () => {
    const linter = createLinter({ "table-req-caption": true });
    const html = "<table><caption>Caption></table><table><td></td><td></td><caption>Caption</caption></table>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});
