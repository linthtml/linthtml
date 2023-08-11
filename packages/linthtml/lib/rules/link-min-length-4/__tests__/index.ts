import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | link-min-length-4", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Ignore link without href attribute", async () => {
    const linter = createLinter({ "link-min-length-4": true });
    const html = "<a>A</a>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it(
    "Report an error for links with text content with less than 4 chars",
    async () => {
      const linter = createLinter({ "link-min-length-4": true });
      const html = '<a href="#">AAA</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );
  it(
    "Report an error for links with an aria-label's content with less than 4 chars",
    async () => {
      const linter = createLinter({ "link-min-length-4": true });
      const html = '<a href="#" aria-label="AAA"></a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );
  it(
    "Report nothing for links with an aria-label's content with more than 4 chars",
    async () => {
      const linter = createLinter({ "link-min-length-4": true });
      const html = '<a href="#" aria-label="AAAAA"></a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );
  it(
    "Report nothing for links with an aria-label's content with 4 chars",
    async () => {
      const linter = createLinter({ "link-min-length-4": true });
      const html = '<a href="#" aria-label="AAAA"></a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );
  it(
    "Report nothing for links with text content with 4 chars",
    async () => {
      const linter = createLinter({ "link-min-length-4": true });
      const html = '<a href="#">AAAA</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );
  it(
    "Report nothing for links with text content with 4 chars",
    async () => {
      const linter = createLinter({ "link-min-length-4": true });
      const html = '<a href="#">AAAAA</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );
  it(
    "Report nothing for links with valid text content (nested)",
    async () => {
      const linter = createLinter({ "link-min-length-4": true });
      const html = '<a href="https://google.com">span>Google</span></a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );
});

describe("link-min-length-4", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Ignore link without href attribute", async () => {
    const linter = createLinter({ "link-min-length-4": true });
    const html = "<a>A</a>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it(
    "Report an error for links with text content with less than 4 chars",
    async () => {
      const linter = createLinter({ "link-min-length-4": true });
      const html = '<a href="#">AAA</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );
  it(
    "Report an error for links with an aria-label's content with less than 4 chars",
    async () => {
      const linter = createLinter({ "link-min-length-4": true });
      const html = '<a href="#" aria-label="AAA"></a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );
  it(
    "Report nothing for links with an aria-label's content with more than 4 chars",
    async () => {
      const linter = createLinter({ "link-min-length-4": true });
      const html = '<a href="#" aria-label="AAAAA"></a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );
  it(
    "Report nothing for links with an aria-label's content with 4 chars",
    async () => {
      const linter = createLinter({ "link-min-length-4": true });
      const html = '<a href="#" aria-label="AAAA"></a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );
  it(
    "Report nothing for links with text content with 4 chars",
    async () => {
      const linter = createLinter({ "link-min-length-4": true });
      const html = '<a href="#">AAAA</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );
  it(
    "Report nothing for links with text content with 4 chars",
    async () => {
      const linter = createLinter({ "link-min-length-4": true });
      const html = '<a href="#">AAAAA</a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );
  it(
    "Report nothing for links with valid text content (nested)",
    async () => {
      const linter = createLinter({ "link-min-length-4": true });
      const html = '<a href="https://google.com">span>Google</span></a>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );
});
