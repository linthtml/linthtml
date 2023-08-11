import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | img-req-src", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report any error for <img> with an src value", async () => {
    const linter = createLinter({ "img-req-src": true });
    const html = '<img src="cat.jpg" alt="A cat picture">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error for <img> without src alt value", async () => {
    const linter = createLinter({ "img-req-src": true });
    const html = "<img>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report an error for <img> with an empty src value", async () => {
    const linter = createLinter({ "img-req-src": true });
    const html = '<img src="">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should check only <img> ", async () => {
    const linter = createLinter({ "img-req-src": true });
    const html = '<div src="">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});
describe("img-req-src", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error for <img> with an src value", async () => {
    const linter = createLinter({ "img-req-src": true });
    const html = '<img src="cat.jpg" alt="A cat picture">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error for <img> without src alt value", async () => {
    const linter = createLinter({ "img-req-src": true });
    const html = "<img>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report an error for <img> with an empty src value", async () => {
    const linter = createLinter({ "img-req-src": true });
    const html = '<img src="">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should check only <img> ", async () => {
    const linter = createLinter({ "img-req-src": true });
    const html = '<div src="">';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});
