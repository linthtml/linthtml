import linthtml from "../../../index.js";
import { presets } from "../../../presets/index.js";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config.js";

describe("legacy linter | html-valid-content-model", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should report an error for every invalid child", async () => {
    const linter = createLinter({ "html-valid-content-model": true });
    const html = `
      <html>
        <head></head>
        <div>A div</div>
        <p>A paragraph</p>
        <button>A button</button>
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(3);
  });

  it("Should not report any error when <html> is missing", async () => {
    const linter = createLinter({ "html-valid-content-model": true });
    const html = `
      <head></head>
      <div>A div</div>
      <p>A paragraph</p>
      <button>A button</button>
      <body></body>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report any error when <head> and <body> are in the correct order", async () => {
    const linter = createLinter({ "html-valid-content-model": true });
    const html = `
        <html>
          <head></head>
          <body></body>
        </html>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error when <head> and <body> are not in the correct order", async () => {
    const linter = createLinter({ "html-valid-content-model": true });
    const html = `
        <html>
          <body></body>
          <head></head>
        </html>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should accept only one <head> as child", async () => {
    const linter = createLinter({ "html-valid-content-model": true });
    const html = `
      <html>
        <head></head>
        <head></head>
        <head></head>
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should accept only one <body> as child", async () => {
    const linter = createLinter({ "html-valid-content-model": true });
    const html = `
      <html>
        <body></body>
        <body></body>
        <body></body>
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });
});
describe("html-valid-content-model", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error for every invalid child", async () => {
    const linter = createLinter({ "html-valid-content-model": true });
    const html = `
      <html>
        <head></head>
        <div>A div</div>
        <p>A paragraph</p>
        <button>A button</button>
      </html>
    `;
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(3);
  });

  it("Should not report any error when <html> is missing", async () => {
    const linter = createLinter({ "html-valid-content-model": true });
    const html = `
      <head></head>
      <div>A div</div>
      <p>A paragraph</p>
      <button>A button</button>
      <body></body>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report any error when <head> and <body> are in the correct order", async () => {
    const linter = createLinter({ "html-valid-content-model": true });
    const html = `
        <html>
          <head></head>
          <body></body>
        </html>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error when <head> and <body> are not in the correct order", async () => {
    const linter = createLinter({ "html-valid-content-model": true });
    const html = `
        <html>
          <body></body>
          <head></head>
        </html>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should accept only one <head> as child", async () => {
    const linter = createLinter({ "html-valid-content-model": true });
    const html = `
      <html>
        <head></head>
        <head></head>
        <head></head>
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should accept only one <body> as child", async () => {
    const linter = createLinter({ "html-valid-content-model": true });
    const html = `
      <html>
        <body></body>
        <body></body>
        <body></body>
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });
});
