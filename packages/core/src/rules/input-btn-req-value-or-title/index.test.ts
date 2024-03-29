import { expect } from "chai";
import linthtml from "../../index.js";
import { presets } from "../../presets/index.js";
import type { LegacyLinterConfig, RuleConfig } from "../../read-config.js";

describe("legacy linter | input-btn-req-value-or-title", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("should fail for an input[button] without value and title", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="button">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("should fail for an input[submit] without value and title", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="submit">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("should fail for an input[reset] without value and title", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="reset">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("should ignore inputs that are not buttons", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="radio">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("should pass when input have a title", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="button" title="button">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("should pass when input have a value", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="button" value="button">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("should pass when input have a none empty aria-label", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="button" aria-label="button">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("should fail when input have an empty aria-label", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="button" aria-label="">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
});
describe("input-btn-req-value-or-title", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("should fail for an input[button] without value and title", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="button">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("should fail for an input[submit] without value and title", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="submit">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("should fail for an input[reset] without value and title", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="reset">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
  it("should ignore inputs that are not buttons", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="radio">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("should pass when input have a title", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="button" title="button">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("should pass when input have a value", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="button" value="button">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("should pass when input have a none empty aria-label", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="button" aria-label="button">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
  it("should fail when input have an empty aria-label", async function () {
    const linter = createLinter({ "input-btn-req-value-or-title": true });
    const html = '<input type="button" aria-label="">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
});
