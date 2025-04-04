import { expect } from "chai";
import linthtml from "../../index.js";
import { presets } from "../../presets/index.js";
import type { LegacyLinterConfig, RuleConfig } from "../../read-config.js";

describe("legacy linter | lang-style", function () {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should report an error for invalid lang code", async function () {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="foo">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error for valid lang code", async function () {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  // TODO: Should not
  it("Should allow empty lang tag", async function () {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error on wrong-case lang", async function () {
    const linter = createLinter({ "lang-style": "case" });
    const html = `
      <!DOCTYPE html>
      <html lang="en-us">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any for correct case lang", async function () {
    const linter = createLinter({ "lang-style": "case" });
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error for invalid config (wrong type)", function () {
    const linter = createLinter({ "lang-style": 0 });
    const html = "";

    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "lang-style" is invalid: Expected boolean got number'
    );
  });

  it("Should throw an error for invalid config (not valid string)", function () {
    const linter = createLinter({ "lang-style": "foo" });
    const html = "";

    expect(() => linter.lint(html)).to.throw(
      'Configuration for rule "lang-style" is invalid: Only "case" is accepted as string value'
    );
  });
});
describe("lang-style", function () {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error for invalid lang code", async function () {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="foo">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error for valid lang code", async function () {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  // TODO: Should not
  it("Should allow empty lang tag", async function () {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error on wrong-case lang", async function () {
    const linter = createLinter({
      "lang-style": [true, "case"]
    });
    const html = `
      <!DOCTYPE html>
      <html lang="en-us">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].code).to.equal("E039");
  });

  it("Should not report any for correct case lang", async function () {
    const linter = createLinter({
      "lang-style": [true, "case"]
    });
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error for invalid config (wrong type)", function () {
    const config = {
      "lang-style": [true, 0] as [boolean, unknown]
    };

    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "lang-style" is invalid: Expected boolean got number'
    );
  });

  it("Should throw an error for invalid config (not valid string)", function () {
    const config = {
      "lang-style": [true, "foo"] as [boolean, unknown]
    };

    expect(() => createLinter(config)).to.throw(
      'Configuration for rule "lang-style" is invalid: Only "case" is accepted as string value'
    );
  });
});
