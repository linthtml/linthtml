import { expect } from "chai";
import linthtml from "../../index.js";
import { presets } from "../../presets/index.js";
import type { LegacyLinterConfig, RuleConfig } from "../../read-config.js";
import { get_config_type } from "../../validate_option.js";

describe("legacy linter | class-no-dup", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }

  it("Should not throw an error if rule config contains an object with a key ignore of string type", async function () {
    const linter = createLinter({ "class-no-dup": { ignore: "foo" } });
    const html = '<div class="foo"></div>';

    linter.lint(html);
    expect(() => linter.lint(html)).to.not.throw();
  });

  it("Should not throw an error if rule config contains an object with a key ignore of Regexp type", async function () {
    const linter = createLinter({ "class-no-dup": { ignore: /foo/ } });
    const html = '<div class="foo"></div>';

    expect(() => linter.lint(html)).to.not.throw();
  });

  it("Should throw an error if rule config contains an unexpected key", async function () {
    const linter = createLinter({ "class-no-dup": { foo: 1 } });
    const html = '<div class="foo"></div>';

    expect(() => linter.lint(html)).to.throw(
      'Object configuration for rule "class-no-dup" is invalid: key "foo" is not accepted, only "ignore" is.'
    );
  });

  [1, "foo", ["foo"]].forEach((config) => {
    it("Should throw an error if rule config contains invalid type", async function () {
      const linter = createLinter({ "class-no-dup": config });
      const html = '<div class="foo"></div>';

      expect(() => linter.lint(html)).to.throw(
        `Configuration for rule "class-no-dup" is invalid: Expected object got ${get_config_type(config)}`
      );
    });
  });

  it("Should not report an error when there's no duplicated classes", async function () {
    const linter = createLinter({ "class-no-dup": true });
    const html = '<div class="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors when there's duplicated classes", async function () {
    const linter = createLinter({ "class-no-dup": true });
    const html = '<div class="foo foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should catch multiple duplicates class", async function () {
    const linter = createLinter({ "class-no-dup": true });
    const html = '<div class="foo foo bar bar"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should catch duplicates class even with leading and trailing whitespaces", async function () {
    const linter = createLinter({ "class-no-dup": true });
    const html = '<div class=" foo foo "></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report errors for duplicates classes not matching a custom separator", async function () {
    const linter = createLinter({
      "class-no-dup": { ignore: /^b/ }
    });
    const html = '<div class="foo foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report errors for duplicates classes matching a custom separator", async function () {
    const linter = createLinter({
      "class-no-dup": { ignore: /^b/ }
    });
    const html = '<div class="bar bar baz baz"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not if `id-class-ignore-regex` contain a capturing group", async function () {
    const linter = createLinter({
      "class-no-dup": { ignore: /^(b)/ }
    });
    const html = '<div class="bar bar baz baz"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});

describe("legacy linter | class-no-dup + id-class-ignore-regexp", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should report errors for duplicates classes not matching a custom separator", async function () {
    const linter = createLinter({
      "class-no-dup": true,
      "id-class-ignore-regex": /^b/
    });
    const html = '<div class="foo foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report errors for duplicates classes matching a custom separator", async function () {
    const linter = createLinter({
      "class-no-dup": true,
      "id-class-ignore-regex": /^b/
    });
    const html = '<div class="bar bar baz baz"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not if `id-class-ignore-regex` contain a capturing group", async function () {
    const linter = createLinter({
      "class-no-dup": true,
      "id-class-ignore-regex": /^(b)/
    });
    const html = '<div class="bar bar baz baz"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});

describe("class-no-dup", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }

  it("Should not throw an error if no rule config is defined", async function () {
    expect(() => createLinter({ "class-no-dup": true })).to.not.throw();
  });

  it("Should not throw an error if rule config contains an object with a key ignore with a string type", async function () {
    expect(() => createLinter({ "class-no-dup": [true, { ignore: "foo" }] })).to.not.throw();
  });

  it("Should not throw an error if rule config contains an object with a key ignore with a Regexp type", async function () {
    expect(() => createLinter({ "class-no-dup": [true, { ignore: /foo/ }] })).to.not.throw();
  });

  it("Should throw an error if rule config contains an unexpected key", async function () {
    expect(() => createLinter({ "class-no-dup": [true, { foo: 1 }] })).to.throw(
      'Object configuration for rule "class-no-dup" is invalid: key "foo" is not accepted, only "ignore" is.'
    );
  });

  [1, "foo", ["foo"], true].forEach((config) => {
    it("Should throw an error if rule config contains invalid type", async function () {
      expect(() => createLinter({ "class-no-dup": [true, config] })).to.throw(
        `Configuration for rule "class-no-dup" is invalid: Expected object got ${get_config_type(config)}`
      );
    });
  });

  it("Should not report an error when there's no duplicated classes", async function () {
    const linter = createLinter({
      "class-no-dup": true
    });
    const html = '<div class="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors when there's duplicated classes", async function () {
    const linter = createLinter({
      "class-no-dup": true
    });
    const html = '<div class="foo foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should catch multiple duplicates class", async function () {
    const linter = createLinter({
      "class-no-dup": true
    });
    const html = '<div class="foo foo bar bar"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should catch duplicates class even with leading and trailing whitespaces", async function () {
    const linter = createLinter({
      "class-no-dup": true
    });
    const html = '<div class=" foo foo "></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report errors for duplicates classes not matching a custom separator", async function () {
    const linter = createLinter({ "class-no-dup": [true, { ignore: /^b/ }] });
    const html = '<div class="foo foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report errors for duplicates classes matching a custom separator", async function () {
    const linter = createLinter({ "class-no-dup": [true, { ignore: /^b/ }] });
    const html = '<div class="bar bar baz baz"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not if `id-class-ignore-regex` contain a capturing group", async function () {
    const linter = createLinter({ "class-no-dup": [true, { ignore: /^(b)/ }] });
    const html = '<div class="bar bar baz baz"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});

describe("class-no-dup + id-class-ignore-regexp", function () {
  function createLinter(ignore: RegExp) {
    return linthtml.fromConfig({
      "id-class-ignore-regex": ignore,
      rules: {
        "class-no-dup": true
      }
    });
  }
  it("Should report errors for duplicates classes not matching a custom separator", async function () {
    const linter = createLinter(/^b/);
    const html = '<div class="foo foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report errors for duplicates classes matching a custom separator", async function () {
    const linter = createLinter(/^b/);
    const html = '<div class="bar bar baz baz"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not if `id-class-ignore-regex` contain a capturing group", async function () {
    const linter = createLinter(/^(b)/);
    const html = '<div class="bar bar baz baz"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
