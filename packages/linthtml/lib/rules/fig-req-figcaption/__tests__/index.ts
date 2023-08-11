import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | fig-req-figcaption", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should report an error when there's no figcaption", async () => {
    const linter = createLinter({ "fig-req-figcaption": true });
    const html = `
      <figure></figure>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  // TODO: Rename test ><
  it("Should report two errors", async () => {
    const linter = createLinter({ "fig-req-figcaption": true });
    const html = `
      <figure></figure>
      <figure><figcaption></figcaption></figure>
      <figure><p>1</p><p>2</p><p>3</p><p>4</p></figure>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should report two errors when figcaption is a sibling", async () => {
    const linter = createLinter({ "fig-req-figcaption": true });
    const html = `
      <figure></figure>
      <figcaption></figcaption>
    `;

    // TODO: assert messages
    // first should be "figure without figcaption"
    // second should be "figcaption without figcaption"
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it(
    "Should not report any error when figcaption is the last child",
    async () => {
      const linter = createLinter({ "fig-req-figcaption": true });
      const html = `
        <figure>
          <p>1</p>  
          <p>2</p>  
          <figcaption></figcaption>
        </figure>
      `;

      // TODO: assert messages
      // first should be "figure without figcaption"
      // second should be "figcaption without figcaption"
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );
});

describe("fig-req-figcaption", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error when there's no figcaption", async () => {
    const linter = createLinter({ "fig-req-figcaption": true });
    const html = `
      <figure></figure>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  // TODO: Rename test ><
  it("Should report two errors", async () => {
    const linter = createLinter({ "fig-req-figcaption": true });
    const html = `
      <figure></figure>
      <figure><figcaption></figcaption></figure>
      <figure><p>1</p><p>2</p><p>3</p><p>4</p></figure>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should report two errors when figcaption is a sibling", async () => {
    const linter = createLinter({ "fig-req-figcaption": true });
    const html = `
      <figure></figure>
      <figcaption></figcaption>
    `;

    // TODO: assert messages
    // first should be "figure without figcaption"
    // second should be "figcaption without figcaption"
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it(
    "Should not report any error when figcaption is the last child",
    async () => {
      const linter = createLinter({ "fig-req-figcaption": true });
      const html = `
        <figure>
          <p>1</p>  
          <p>2</p>  
          <figcaption></figcaption>
        </figure>
      `;

      // TODO: assert messages
      // first should be "figure without figcaption"
      // second should be "figcaption without figcaption"
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );
});
