import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | input-radio-req-name", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report any error for radio input with a name", async () => {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = '<input type="radio" name="foo">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error for radio input without a name", async () => {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = '<input type="radio">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it(
    "Should report an error for radio input with an empty name value",
    async () => {
      const linter = createLinter({ "input-radio-req-name": true });
      const html = '<input type="radio" name="">';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it("Should not report any error if input with no type", async () => {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = "<input>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report any error if input is not a radio input", async () => {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = '<input type="text">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should check only input radio ", async () => {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = '<div name="">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});
describe("legacy linter | input-radio-req-name", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error for radio input with a name", async () => {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = '<input type="radio" name="foo">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error for radio input without a name", async () => {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = '<input type="radio">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it(
    "Should report an error for radio input with an empty name value",
    async () => {
      const linter = createLinter({ "input-radio-req-name": true });
      const html = '<input type="radio" name="">';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it("Should not report any error if input with no type", async () => {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = "<input>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report any error if input is not a radio input", async () => {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = '<input type="text">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should check only input radio ", async () => {
    const linter = createLinter({ "input-radio-req-name": true });
    const html = '<div name="">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});
