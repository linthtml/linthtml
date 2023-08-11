import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | id-class-no-ad", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }

  describe('"ad" word', () => {
    it('Should not report any error for "class" attributes not containing "ad"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = '<div class="foo">Foo</div>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it('Should not report any error for "id" attributes not containing "ad"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = '<div id="foo">Foo</div>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it('Should report an error for "class" attributes containing "ad"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div class="ad">Foo</div>
        <div class="my_ad_class">Foo</div>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });

    it('Should report an error for "id" attributes containing "ad"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div id="ad">Foo</div>
        <div id="my_ad_id">Foo</div>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });

    it("Should not report any error for adjacent world", async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div class="adjacent">Foo</div>
      `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });
  });

  describe('"social" word', () => {
    it('Should not report any error for "class" attributes not containing "social"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = '<div class="foo">Foo</div>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it('Should not report any error for "id" attributes not containing "social"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = '<div id="foo">Foo</div>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it('Should report an error for "class" attributes containing "social"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div class="social">Foo</div>
        <div class="my_social_class">Foo</div>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });

    it('Should report an error for "id" attributes containing "social"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div id="ad">Foo</div>
        <div id="my_social_id">Foo</div>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });

    it("Should not report any error for adjacent world", async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div class="socialize">Foo</div>
      `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });
  });

  describe('"banner" word', () => {
    it('Should not report any error for "class" attributes not containing "banner"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = '<div class="foo">Foo</div>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it('Should not report any error for "id" attributes not containing "banner"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = '<div id="foo">Foo</div>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it('Should report an error for "class" attributes containing "banner"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div class="banner">Foo</div>
        <div class="my_banner_class">Foo</div>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });

    it('Should report an error for "id" attributes containing "banner"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div id="ad">Foo</div>
        <div id="my_banner_id">Foo</div>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });
  });

  it("Should not report any error for adjacent world", async () => {
    const linter = createLinter({ "id-class-no-ad": true });
    const html = `
      <div class="bannerman">Foo</div>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Rule should not fail if id or class attribute has no value", async () => {
    const linter = createLinter({ "id-class-no-ad": true });
    const html = `
        <div id class></div>
      `;

    expect(() => linter.lint(html)).not.toThrow();
  });
});

describe("id-class-no-ad", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  describe('"ad" word', () => {
    it('Should not report any error for "class" attributes not containing "ad"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = '<div class="foo">Foo</div>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it('Should not report any error for "id" attributes not containing "ad"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = '<div id="foo">Foo</div>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it('Should report an error for "class" attributes containing "ad"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div class="ad">Foo</div>
        <div class="my_ad_class">Foo</div>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });

    it('Should report an error for "id" attributes containing "ad"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div id="ad">Foo</div>
        <div id="my_ad_id">Foo</div>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });
  });

  describe('"social" word', () => {
    it('Should not report any error for "class" attributes not containing "social"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = '<div class="foo">Foo</div>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it('Should not report any error for "id" attributes not containing "social"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = '<div id="foo">Foo</div>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it('Should report an error for "class" attributes containing "social"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div class="social">Foo</div>
        <div class="my_social_class">Foo</div>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });

    it('Should report an error for "id" attributes containing "social"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div id="ad">Foo</div>
        <div id="my_social_id">Foo</div>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });

    it("Should not report any error for adjacent world", async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div class="socialize">Foo</div>
      `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });
  });

  describe('"banner" word', () => {
    it('Should not report any error for "class" attributes not containing "banner"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = '<div class="foo">Foo</div>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it('Should not report any error for "id" attributes not containing "banner"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = '<div id="foo">Foo</div>';

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it('Should report an error for "class" attributes containing "banner"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div class="banner">Foo</div>
        <div class="my_banner_class">Foo</div>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });

    it('Should report an error for "id" attributes containing "banner"', async () => {
      const linter = createLinter({ "id-class-no-ad": true });
      const html = `
        <div id="ad">Foo</div>
        <div id="my_banner_id">Foo</div>
        `;

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(2);
    });
  });

  it("Should not report any error for adjacent world", async () => {
    const linter = createLinter({ "id-class-no-ad": true });
    const html = `
      <div class="bannerman">Foo</div>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Rule should not fail if id or class attribute has no value", async () => {
    const linter = createLinter({ "id-class-no-ad": true });
    const html = `
        <div id class></div>
      `;

    expect(() => linter.lint(html)).not.toThrow();
  });
});
