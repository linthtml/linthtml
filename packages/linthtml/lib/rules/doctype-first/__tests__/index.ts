import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | doctype-first", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Should not report any error when DOCTYPE is first", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <!DOCTYPE>
      <html></html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should be case-insensitive", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <!doctype>
      <html></html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error when doctype is not present", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <html></html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report an error when DOCTYPE is not first", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <html></html>
      <!DOCTYPE>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should not report any error when there's multiple DOCTYPE (if one is first)", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
        <!DOCTYPE>
        <!DOCTYPE>
        <html></html>
        <!DOCTYPE>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  // should report an error
  it("Should not report any error if the first element is not an html tag", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
        foobar
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  // should report an error
  it("Should not report any error if the first element is a comment", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
        <!-- A comment -->
        <!DOCTYPE>
        <html></html>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  describe("`smart` mode", () => {
    it("Should not report any error when there's no doctype and <head>", async () => {
      const linter = createLinter({ "doctype-first": "smart" });
      const html = `
          <section></section>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error when there's no doctype but an <head>", async () => {
      const linter = createLinter({ "doctype-first": "smart" });
      const html = `
          <head></head>
          <section></section>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  it("Should throw an error for invalid config (wrong type)", () => {
    const linter = createLinter({ "doctype-first": 0 });
    const html = '<div class="foo"></div>';

    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "doctype-first" is invalid: Expected boolean got number'
    );
  });

  it("Should throw an error for invalid config (not valid string)", () => {
    const linter = createLinter({ "doctype-first": "foo" });
    const html = '<div class="bar"></div>';

    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "doctype-first" is invalid: Only "smart" is accepted as string value'
    );
  });
});
describe("doctype-first", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error when DOCTYPE is first", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <!DOCTYPE>
      <html></html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should be case-insensitive", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <!doctype>
      <html></html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report an error when doctype is not present", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <html></html>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report an error when DOCTYPE is not first", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
      <html></html>
      <!DOCTYPE>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should not report any error when there's multiple DOCTYPE (if one is first)", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
        <!DOCTYPE>
        <!DOCTYPE>
        <html></html>
        <!DOCTYPE>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  // should report an error
  it("Should not report any error if the first element is not an html tag", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
        foobar
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  // should report an error
  it("Should not report any error if the first element is a comment", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
        <!-- A comment -->
        <!DOCTYPE>
        <html></html>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  // should report an error
  it("Should report if first node is a comment an second is not the doctype", async () => {
    const linter = createLinter({ "doctype-first": true });
    const html = `
        <!-- A comment -->
        <html></html>
        <!DOCTYPE>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  describe("`smart` mode", () => {
    it("Should not report any error when there's no doctype and <head>", async () => {
      const linter = createLinter({
        "doctype-first": [true, "smart"]
      });
      const html = `
          <section></section>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error when there's no doctype but an <head>", async () => {
      const linter = createLinter({
        "doctype-first": [true, "smart"]
      });
      const html = `
          <head></head>
          <section></section>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  it("Should throw an error for invalid config (wrong type)", () => {
    const config = {
      "doctype-first": [true, 0] as [boolean, unknown]
    };
    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "doctype-first" is invalid: Expected boolean got number'
    );
  });

  it("Should throw an error for invalid config (not valid string)", () => {
    const config = {
      "doctype-first": [true, "foo"] as [boolean, unknown]
    };
    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "doctype-first" is invalid: Only "smart" is accepted as string value'
    );
  });
});
