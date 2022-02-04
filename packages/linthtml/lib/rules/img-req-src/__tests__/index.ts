import { expect } from "chai";
import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | img-req-src", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report any error for <img> with an src value", async function () {
    const linter = createLinter({ "img-req-src": true });
    const html = '<img src="cat.jpg" alt="A cat picture">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for <img> without src alt value", async function () {
    const linter = createLinter({ "img-req-src": true });
    const html = "<img>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error for <img> with an empty src value", async function () {
    const linter = createLinter({ "img-req-src": true });
    const html = '<img src="">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should check only <img> ", async function () {
    const linter = createLinter({ "img-req-src": true });
    const html = '<div src="">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
describe("img-req-src", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error for <img> with an src value", async function () {
    const linter = createLinter({ "img-req-src": true });
    const html = '<img src="cat.jpg" alt="A cat picture">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for <img> without src alt value", async function () {
    const linter = createLinter({ "img-req-src": true });
    const html = "<img>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error for <img> with an empty src value", async function () {
    const linter = createLinter({ "img-req-src": true });
    const html = '<img src="">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should check only <img> ", async function () {
    const linter = createLinter({ "img-req-src": true });
    const html = '<div src="">';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
