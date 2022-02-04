import { expect } from "chai";
import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | attr-quote-style", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should report an error for unquoted attribute", async function () {
    const linter = createLinter({ "attr-quote-style": "quoted" });
    const html = "<div class=foo></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error for quoted attribute", async function () {
    const linter = createLinter({ "attr-quote-style": "quoted" });
    const html = '<div class="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when invalid quote style is used (single quoted attr in double mode)", async function () {
    const linter = createLinter({ "attr-quote-style": "double" });
    const html = "<div class='foo'></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when invalid quote style is used (double quoted attr in single mode)", async function () {
    const linter = createLinter({ "attr-quote-style": "single" });
    const html = '<div class="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should ignore attributes with no values", async function () {
    const linter = createLinter({ "attr-quote-style": "single" });
    const html = "<button disabled>Button</button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error when an invalid config is provided (invalid string)", function () {
    const linter = createLinter({ "attr-quote-style": "unknown" });
    const html = "";
    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "attr-quote-style" is invalid: "unknown" is not accepted. Accepted values are "double", "single" and "quoted".'
    );
  });

  it("Should throw an error when an invalid config is provided (invalid type)", function () {
    const linter = createLinter({ "attr-quote-style": 3 });
    const html = "";
    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "attr-quote-style" is invalid: Expected string got number.'
    );
  });
});

describe("attr-quote-style", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error for unquoted attribute", async function () {
    const linter = createLinter({
      "attr-quote-style": [true, "quoted"]
    });
    const html = "<div class=foo></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error for quoted attribute", async function () {
    const linter = createLinter({
      "attr-quote-style": [true, "quoted"]
    });
    const html = '<div class="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when invalid quote style is used (single quoted attr in double mode)", async function () {
    const linter = createLinter({
      "attr-quote-style": [true, "double"]
    });
    const html = "<div class='foo'></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when invalid quote style is used (double quoted attr in single mode)", async function () {
    const linter = createLinter({
      "attr-quote-style": [true, "single"]
    });
    const html = '<div class="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should ignore attributes with no values", async function () {
    const linter = createLinter({
      "attr-quote-style": [true, "single"]
    });
    const html = "<button disabled>Button</button>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error when an invalid config is provided (invalid string)", function () {
    const config = {
      "attr-quote-style": [true, "unknown"] as [boolean, unknown]
    };
    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "attr-quote-style" is invalid: "unknown" is not accepted. Accepted values are "double", "single" and "quoted".'
    );
  });

  it("Should throw an error when an invalid config is provided (invalid type)", function () {
    const config = {
      "attr-quote-style": [true, 3] as [boolean, unknown]
    };
    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "attr-quote-style" is invalid: Expected string got number.'
    );
  });
});
