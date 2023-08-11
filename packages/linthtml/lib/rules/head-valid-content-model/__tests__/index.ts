import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | head-valid-content-model", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should report an error for every invalid child", async () => {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <head>
        <div>a div</div>
        <p>a paragraph</p>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should not report any error when <head> is not present", async () => {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <body></body>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report any error for valid child element", async () => {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <head>
        <title></title>
        <link></link>
        <script></script>
        <style></style>
        <template></template>
        <noscript></noscript>
        <meta></meta>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
  it("Should not report any error for empty <head> element", async () => {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <head>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});

describe("head-valid-content-model", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error for every invalid child", async () => {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <head>
        <div>a div</div>
        <p>a paragraph</p>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should not report any error when <head> is not present", async () => {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <body></body>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should not report any error for valid child element", async () => {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <head>
        <title></title>
        <link></link>
        <script></script>
        <style></style>
        <template></template>
        <noscript></noscript>
        <meta></meta>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
  it("Should not report any error for empty <head> element", async () => {
    const linter = createLinter({ "head-valid-content-model": true });
    const html = `
    <html>
      <head>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});
