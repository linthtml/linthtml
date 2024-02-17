import linthtml from "../../../index.js";
import { presets } from "../../../presets/index.js";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config.js";

describe("legacy linter | focusable-tabindex-style", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should report errors for tag with positive tabindex", async () => {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="foo" tabindex="5">
      <label for="foo">Foo input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should not report any error for tag without tabindex attribute", async () => {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
        <input type="text" name="foo">
        <label for="foo">Foo input</label>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report an error for tag with negative tabindex", async () => {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="bar" tabindex="-5">
      <label for="bar">Bar input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error per tag with a positive tabindex", async () => {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="bar" tabindex="-5">
      <label for="bar">Bar input</label>
      <input type="text" name="foo" tabindex="5">
      <label for="foo">Foo input</label>
      <input type="text" name="baz" tabindex="-5">
      <label for="baz">Baz input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should ignore disabled tag", async () => {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="bar" tabindex="-5" disabled>
      <label for="bar">Bar input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report error for non interactive elements", async () => {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <div tabindex="5"></div>
    `;

    const issues = await linter.lint(html);

    expect(issues).toHaveLength(1);
  });
});
describe("focusable-tabindex-style", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report errors for tag with positive tabindex", async () => {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="foo" tabindex="5">
      <label for="foo">Foo input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should not report any error for tag without tabindex attribute", async () => {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
        <input type="text" name="foo">
        <label for="foo">Foo input</label>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report an error for tag with negative tabindex", async () => {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="bar" tabindex="-5">
      <label for="bar">Bar input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error per tag with positive tabindex", async () => {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="bar" tabindex="-5">
      <label for="bar">Bar input</label>
      <input type="text" name="foo" tabindex="5">
      <label for="foo">Foo input</label>
      <input type="text" name="baz" tabindex="-5">
      <label for="baz">Baz input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should ignore disabled tag", async () => {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <input type="text" name="bar" tabindex="-5" disabled>
      <label for="bar">Bar input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report error for non interactive elements", async () => {
    const linter = createLinter({ "focusable-tabindex-style": true });
    const html = `
      <div tabindex="5"></div>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });
});
