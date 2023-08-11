import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | head-req-title", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report any error when the head title is present", async () => {
    const linter = createLinter({ "head-req-title": true });
    const html = `
      <html>
        <head>
          <title>Title!</title>
        </head>
      </html>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error when the head title is not present", async () => {
    const linter = createLinter({ "head-req-title": true });
    const html = `
    <html>
      <head>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report an error when the head title is empty", async () => {
    const linter = createLinter({ "head-req-title": true });
    const html = `
    <html>
      <head>
        <title></title>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  describe("Multiple <title>", () => {
    it("Should not report any error when one title is not empty", async () => {
      const linter = createLinter({ "head-req-title": true });
      const html = `
      <html>
        <head>
          <title></title>
          <title>Foo</title>
        </head>
      </html>
      `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report any errors when all titles are empty", async () => {
      const linter = createLinter({ "head-req-title": true });
      const html = `
      <html>
        <head>
          <title></title>
          <title></title>
        </head>
      </html>
      `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });
});
describe("legacy linter | head-req-title", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error when the head title is present", async () => {
    const linter = createLinter({ "head-req-title": true });
    const html = `
      <html>
        <head>
          <title>Title!</title>
        </head>
      </html>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error when the head title is not present", async () => {
    const linter = createLinter({ "head-req-title": true });
    const html = `
    <html>
      <head>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report an error when the head title is empty", async () => {
    const linter = createLinter({ "head-req-title": true });
    const html = `
    <html>
      <head>
        <title></title>
      </head>
    </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  describe("Multiple <title>", () => {
    it("Should not report any error when one title is not empty", async () => {
      const linter = createLinter({ "head-req-title": true });
      const html = `
      <html>
        <head>
          <title></title>
          <title>Foo</title>
        </head>
      </html>
      `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report any errors when all titles are empty", async () => {
      const linter = createLinter({ "head-req-title": true });
      const html = `
      <html>
        <head>
          <title></title>
          <title></title>
        </head>
      </html>
      `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });
});
