import { LegacyLinterConfig, RuleConfig } from "../../../read-config";
import linthtml from "../../../index";
import { presets } from "../../../presets";

describe("legacy linter | attr-no-dup", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report an error when an attribute is not duplicated", async () => {
    const linter = createLinter({ "attr-no-dup": true });
    const html = '<div class="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error when an attribute is duplicated", async () => {
    const linter = createLinter({ "attr-no-dup": true });
    const html = '<div class="foo" class="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should catch multiple duplicates in one element", async () => {
    const linter = createLinter({ "attr-no-dup": true });
    const html = '<div class="foo" class="foo" id="bar" id="bar"></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should catch duplicates on multiple elements", async () => {
    const linter = createLinter({ "attr-no-dup": true });
    const html = "<div class='foo' class='foo'><p id='bar' id='bar'>Text</p></div>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should be case insensitive", async () => {
    const linter = createLinter({ "attr-no-dup": true });
    const html = "<div class='foo' Class='foo'></div>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should throw an error when an invalid config is provided", () => {
    const linter = createLinter({ "attr-no-dup": "toto" });
    const html = `
      <div
        class="foo"
        id>
      </div>
    `;
    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "attr-no-dup" is invalid: Expected boolean got string'
    );
  });
});
describe("attr-no-dup", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report an error when an attribute is not duplicated", async () => {
    const linter = createLinter({
      "attr-no-dup": true
    });
    const html = '<div class="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error when an attribute is duplicated", async () => {
    const linter = createLinter({
      "attr-no-dup": true
    });
    const html = '<div class="foo" class="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should catch multiple duplicates in one element", async () => {
    const linter = createLinter({
      "attr-no-dup": true
    });
    const html = '<div class="foo" class="foo" id="bar" id="bar"></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should catch duplicates on multiple elements", async () => {
    const linter = createLinter({
      "attr-no-dup": true
    });
    const html = "<div class='foo' class='foo'><p id='bar' id='bar'>Text</p></div>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Should be case insensitive", async () => {
    const linter = createLinter({
      "attr-no-dup": true
    });
    const html = "<div class='foo' Class='foo'></div>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  // handle by Config
  // it("Should throw an error when an invalid config is provided", function() {
  //   const config = {
  //     "attr-no-dup": [
  //       "toto"
  //     ]
  //   };
  //   expect(() => createLinter(config))
  //     .to
  //     .throw("Configuration for rule \"attr-no-dup\" is invalid: Expected boolean got string");
  // });
});
