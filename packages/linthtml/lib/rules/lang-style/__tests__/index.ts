import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | lang-style", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should report an error for invalid lang code", async () => {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="foo">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should not report any error for valid lang code", async () => {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  // TODO: Should not
  it("Should allow empty lang tag", async () => {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error on wrong-case lang", async () => {
    const linter = createLinter({ "lang-style": "case" });
    const html = `
      <!DOCTYPE html>
      <html lang="en-us">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should not report any for correct case lang", async () => {
    const linter = createLinter({ "lang-style": "case" });
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should throw an error for invalid config (wrong type)", () => {
    const linter = createLinter({ "lang-style": 0 });
    const html = "";

    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "lang-style" is invalid: Expected boolean got number'
    );
  });

  it(
    "Should throw an error for invalid config (not valid string)",
    () => {
      const linter = createLinter({ "lang-style": "foo" });
      const html = "";

      expect(() => linter.lint(html)).toThrow(
        'Configuration for rule "lang-style" is invalid: Only "case" is accepted as string value'
      );
    }
  );
});
describe("lang-style", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error for invalid lang code", async () => {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="foo">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should not report any error for valid lang code", async () => {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  // TODO: Should not
  it("Should allow empty lang tag", async () => {
    const linter = createLinter({ "lang-style": true });
    const html = `
      <!DOCTYPE html>
      <html lang="">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error on wrong-case lang", async () => {
    const linter = createLinter({
      "lang-style": [true, "case"]
    });
    const html = `
      <!DOCTYPE html>
      <html lang="en-us">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should not report any for correct case lang", async () => {
    const linter = createLinter({
      "lang-style": [true, "case"]
    });
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should throw an error for invalid config (wrong type)", () => {
    const config = {
      "lang-style": [true, 0] as [boolean, unknown]
    };

    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "lang-style" is invalid: Expected boolean got number'
    );
  });

  it(
    "Should throw an error for invalid config (not valid string)",
    () => {
      const config = {
        "lang-style": [true, "foo"] as [boolean, unknown]
      };

      expect(() => createLinter(config)).toThrow(
        'Configuration for rule "lang-style" is invalid: Only "case" is accepted as string value'
      );
    }
  );
});
