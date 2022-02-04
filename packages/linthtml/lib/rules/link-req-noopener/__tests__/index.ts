import { expect } from "chai";
import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | link-rel-noopener", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it('Should not report any error when "target" does not equal "_blank"', async function () {
    const linter = createLinter({ "link-req-noopener": true });
    const html = '<a href="index.html">index</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it('Should report an error when "target" equal "_blank" and "rel" attribute is undefined', async function () {
    const linter = createLinter({ "link-req-noopener": true });
    const html = '<a href="https://site.com" target="_blank">Site</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it('Should report an error when "target" equal "_blank" and "rel" attribute is not equal to "noopener" or "noreferrer"', async function () {
    const linter = createLinter({ "link-req-noopener": true });
    const html = '<a href="https://site.com" target="_blank" rel="nofoloow">Site</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it('Should report an error when "target" equal "_blank" and "rel" attribute equal "noopener"', async function () {
    const linter = createLinter({ "link-req-noopener": true });
    const html = '<a href="https://site.com" target="_blank" rel="noopener">Site</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it('Should report an error when "target" equal "_blank" and "rel" attribute equal "noreferrer"', async function () {
    const linter = createLinter({ "link-req-noopener": true });
    const html = '<a href="https://site.com" target="_blank" rel="noreferrer">Site</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it('Should report an error when "target" equal "_blank" and "rel" attribute equal "noreferrer" and "noopener"', async function () {
    const linter = createLinter({ "link-req-noopener": true });
    const html = '<a href="https://site.com" target="_blank" rel="noreferrer noopener">Site</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});

describe("link-rel-noopener", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it('Should not report any error when "target" does not equal "_blank"', async function () {
    const linter = createLinter({ "link-req-noopener": true });
    const html = '<a href="index.html">index</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it('Should report an error when "target" equal "_blank" and "rel" attribute is undefined', async function () {
    const linter = createLinter({ "link-req-noopener": true });
    const html = '<a href="https://site.com" target="_blank">Site</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it('Should report an error when "target" equal "_blank" and "rel" attribute is not equal to "noopener" or "noreferrer"', async function () {
    const linter = createLinter({ "link-req-noopener": true });
    const html = '<a href="https://site.com" target="_blank" rel="nofoloow">Site</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it('Should report an error when "target" equal "_blank" and "rel" attribute equal "noopener"', async function () {
    const linter = createLinter({ "link-req-noopener": true });
    const html = '<a href="https://site.com" target="_blank" rel="noopener">Site</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it('Should report an error when "target" equal "_blank" and "rel" attribute equal "noreferrer"', async function () {
    const linter = createLinter({ "link-req-noopener": true });
    const html = '<a href="https://site.com" target="_blank" rel="noreferrer">Site</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it('Should report an error when "target" equal "_blank" and "rel" attribute equal "noreferrer" and "noopener"', async function () {
    const linter = createLinter({ "link-req-noopener": true });
    const html = '<a href="https://site.com" target="_blank" rel="noreferrer noopener">Site</a>';

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
