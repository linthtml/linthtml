import { expect } from "chai";
import linthtml from "../../index.js";
import { presets } from "../../presets/index.js";
import type { LegacyLinterConfig, RuleConfig } from "../../read-config.js";

describe("legacy linter | link-label-min-length", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Ignore link without href attribute", async function () {
    const linter = createLinter({ "link-label-min-length": 6 });
    const html = "<a>A</a>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Report an error for links with text content with less than 6 chars", async function () {
    const linter = createLinter({ "link-label-min-length": 6 });
    const html = '<a href="#">AAA</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("Report an error for links with an aria-label's content with less than 6 chars", async function () {
    const linter = createLinter({ "link-label-min-length": 6 });
    const html = '<a href="#" aria-label="AAA"></a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("Report nothing for links with an aria-label's content with more than 6 chars", async function () {
    const linter = createLinter({ "link-label-min-length": 6 });
    const html = '<a href="#" aria-label="AAAAAAA"></a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Report nothing for links with an aria-label's content with 6 chars", async function () {
    const linter = createLinter({ "link-label-min-length": 6 });
    const html = '<a href="#" aria-label="AAAAAA"></a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Report nothing for links with text content with 7 chars", async function () {
    const linter = createLinter({ "link-label-min-length": 6 });
    const html = '<a href="#">AAAAAAA</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Report nothing for links with text content with 6 chars", async function () {
    const linter = createLinter({ "link-label-min-length": 6 });
    const html = '<a href="#">AAAAAA</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Report nothing for links with valid text content (nested)", async function () {
    const linter = createLinter({ "link-label-min-length": 6 });
    const html = '<a href="https://google.com">span>Google</span></a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});

describe("link-label-min-length", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Ignore link without href attribute", async function () {
    const linter = createLinter({ "link-label-min-length": [true, 6] });
    const html = "<a>A</a>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Report an error for links with text content with less than 6 chars", async function () {
    const linter = createLinter({ "link-label-min-length": [true, 6] });
    const html = '<a href="#">AAA</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("Report an error for links with an aria-label's content with less than 6 chars", async function () {
    const linter = createLinter({ "link-label-min-length": [true, 6] });
    const html = '<a href="#" aria-label="AAA"></a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("Report nothing for links with an aria-label's content with more than 6 chars", async function () {
    const linter = createLinter({ "link-label-min-length": [true, 6] });
    const html = '<a href="#" aria-label="AAAAAAA"></a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Report nothing for links with an aria-label's content with 6 chars", async function () {
    const linter = createLinter({ "link-label-min-length": [true, 6] });
    const html = '<a href="#" aria-label="AAAAAA"></a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Report nothing for links with text content with 7 chars", async function () {
    const linter = createLinter({ "link-label-min-length": [true, 6] });
    const html = '<a href="#">AAAAAAA</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Report nothing for links with text content with 6 chars", async function () {
    const linter = createLinter({ "link-label-min-length": [true, 6] });
    const html = '<a href="#">AAAAAA</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("Report nothing for links with valid text content (nested)", async function () {
    const linter = createLinter({ "link-label-min-length": [true, 6] });
    const html = '<a href="https://google.com">span>Google</span></a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
