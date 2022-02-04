import { expect } from "chai";
import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | tag-close", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }

  it("Should report an error for not matching open/close tags", async function () {
    const linter = createLinter({ "tag-close": true });
    const html = "<body></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error per none matching open/close tags", async function () {
    const linter = createLinter({ "tag-close": true });
    const html = "<body><p></span></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not report an error for self closing tags", async function () {
    const linter = createLinter({ "tag-close": true });
    const html = "<br/><br>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error for unicode chars", async function () {
    const linter = createLinter({ "tag-close": true });
    const html = "<span>&#8599;</span>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});

describe("tag-close", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }

  it("Should report an error for not matching open/close tags", async function () {
    const linter = createLinter({ "tag-close": true });
    const html = "<body></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error per none matching open/close tags", async function () {
    const linter = createLinter({ "tag-close": true });
    const html = "<body><p></span></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not report an error for self closing tags", async function () {
    const linter = createLinter({ "tag-close": true });
    const html = "<br/><br>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error for unicode chars", async function () {
    const linter = createLinter({ "tag-close": true });
    const html = "<span>&#8599;</span>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
