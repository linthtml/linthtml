import linthtml from "../../../index.js";
import { presets } from "../../../presets/index.js";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config.js";

describe("legacy linter | doctype-html5", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report any error for a valid html5 DOCTYPE", async () => {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!DOCTYPE html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error when DOCTYPE is not for html5", async () => {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n"http://www.w3.org/TR/html4/strict.dtd">
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report an error given a legacy doctype", async () => {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!DOCTYPE html SYSTEM "about:legacy-compat">
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should not report an error if there's no doctype", async () => {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!random g">
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});
describe("doctype-html5", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error for a valid html5 DOCTYPE", async () => {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!DOCTYPE html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error when DOCTYPE is not for html5", async () => {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n"http://www.w3.org/TR/html4/strict.dtd">
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report an error given a legacy doctype", async () => {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!DOCTYPE html SYSTEM "about:legacy-compat">
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should not report an error if there's not doctype", async () => {
    const linter = createLinter({ "doctype-html5": true });
    const html = `
      <!random g">
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});
