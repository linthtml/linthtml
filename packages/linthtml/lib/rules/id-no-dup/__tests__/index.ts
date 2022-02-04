import { expect } from "chai";
import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | id-no-dup", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report an error when there's no duplicated id", async function () {
    const linter = createLinter({ "id-no-dup": true });
    const html = '<div id="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors when there's duplicated id", async function () {
    const linter = createLinter({ "id-no-dup": true });
    const html = `
      <div id="foo"></div>
      <div id="foo"></div>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should catch multiple duplicates id", async function () {
    const linter = createLinter({ "id-no-dup": true });
    const html = `
      <div id="foo"></div>
      <div id="bar"></div>
      <div id="foo"></div>
      <div id="bar"></div>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Rule should not fail if id attribute has no value", async function () {
    const linter = createLinter({ "id-no-dup": true });
    const html = `
      <div id></div>
    `;

    expect(() => linter.lint(html)).to.not.throw();
  });

  // TODO: should ignore trailing/leading space ?
  // it("Should catch duplicates id even with leading and trailing whitespaces", async function() {
  //   const linter = createLinter();
  //   const html = `
  //     <div id="foo"></div>
  //     <div id="bar "></div>
  //     <div id=" foo"></div>
  //     <div id="bar"></div>
  //   `;

  //   const issues = await linter.lint(html, { "id-no-dup": true });
  //     expect(issues).to.have.lengthOf(2);
  //     done();
  //   });
  // });
});

describe("id-no-dup", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report an error when there's no duplicated id", async function () {
    const linter = createLinter({ "id-no-dup": true });
    const html = '<div id="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors when there's duplicated id", async function () {
    const linter = createLinter({ "id-no-dup": true });
    const html = `
      <div id="foo"></div>
      <div id="foo"></div>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should catch multiple duplicates id", async function () {
    const linter = createLinter({ "id-no-dup": true });
    const html = `
      <div id="foo"></div>
      <div id="bar"></div>
      <div id="foo"></div>
      <div id="bar"></div>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Rule should not fail if id attribute has no value", async function () {
    const linter = createLinter({ "id-no-dup": true });
    const html = `
      <div id></div>
    `;

    expect(() => linter.lint(html)).to.not.throw();
  });

  // TODO: should ignore trailing/leading space ?
  // it("Should catch duplicates id even with leading and trailing whitespaces", async function() {
  //   const linter = createLinter();
  //   const html = `
  //     <div id="foo"></div>
  //     <div id="bar "></div>
  //     <div id=" foo"></div>
  //     <div id="bar"></div>
  //   `;

  //   const issues = await linter.lint(html, { "id-no-dup": true });
  //     expect(issues).to.have.lengthOf(2);
  //     done();
  //   });
  // });
});
