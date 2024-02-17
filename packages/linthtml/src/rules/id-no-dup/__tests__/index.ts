import linthtml from "../../../index.js";
import { presets } from "../../../presets/index.js";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config.js";

describe("legacy linter | id-no-dup", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report an error when there's no duplicated id", async () => {
    const linter = createLinter({ "id-no-dup": true });
    const html = '<div id="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report errors when there's duplicated id", async () => {
    const linter = createLinter({ "id-no-dup": true });
    const html = `
      <div id="foo"></div>
      <div id="foo"></div>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should catch multiple duplicates id", async () => {
    const linter = createLinter({ "id-no-dup": true });
    const html = `
      <div id="foo"></div>
      <div id="bar"></div>
      <div id="foo"></div>
      <div id="bar"></div>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Rule should not fail if id attribute has no value", async () => {
    const linter = createLinter({ "id-no-dup": true });
    const html = `
      <div id></div>
    `;

    expect(() => linter.lint(html)).not.toThrow();
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

describe("id-no-dup", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report an error when there's no duplicated id", async () => {
    const linter = createLinter({ "id-no-dup": true });
    const html = '<div id="foo"></div>';

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report errors when there's duplicated id", async () => {
    const linter = createLinter({ "id-no-dup": true });
    const html = `
      <div id="foo"></div>
      <div id="foo"></div>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should catch multiple duplicates id", async () => {
    const linter = createLinter({ "id-no-dup": true });
    const html = `
      <div id="foo"></div>
      <div id="bar"></div>
      <div id="foo"></div>
      <div id="bar"></div>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("Rule should not fail if id attribute has no value", async () => {
    const linter = createLinter({ "id-no-dup": true });
    const html = `
      <div id></div>
    `;

    expect(() => linter.lint(html)).not.toThrow();
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
