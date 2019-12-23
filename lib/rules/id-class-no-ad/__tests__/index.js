const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("id-class-no-ad", function() {
  describe("\"ad\" word", function() {
    it("Should not report any error for \"class\" attributes not containing \"ad\"", async function() {
      const linter = createLinter();
      const html = "<div class=\"foo\">Foo</div>";

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for \"id\" attributes not containing \"ad\"", async function() {
      const linter = createLinter();
      const html = "<div id=\"foo\">Foo</div>";

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for \"class\" attributes containing \"ad\"", async function() {
      const linter = createLinter();
      const html = `
      <div class="ad">Foo</div>
      <div class="my_ad_class">Foo</div>
      `;

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(2);
    });

    it("Should report an error for \"id\" attributes containing \"ad\"", async function() {
      const linter = createLinter();
      const html = `
      <div id="ad">Foo</div>
      <div id="my_ad_id">Foo</div>
      `;

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(2);
    });
  });

  describe("\"ad\" word", function() {
    it("Should not report any error for \"class\" attributes not containing \"ad\"", async function() {
      const linter = createLinter();
      const html = "<div class=\"foo\">Foo</div>";

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for \"id\" attributes not containing \"ad\"", async function() {
      const linter = createLinter();
      const html = "<div id=\"foo\">Foo</div>";

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for \"class\" attributes containing \"ad\"", async function() {
      const linter = createLinter();
      const html = `
      <div class="ad">Foo</div>
      <div class="my_ad_class">Foo</div>
      `;

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(2);
    });

    it("Should report an error for \"id\" attributes containing \"ad\"", async function() {
      const linter = createLinter();
      const html = `
      <div id="ad">Foo</div>
      <div id="my_ad_id">Foo</div>
      `;

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(2);
    });

    it("Should not report any error for adjacent world", async function() {
      const linter = createLinter();
      const html = `
        <div class="adjacent">Foo</div>
      `;

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(0);
    });
  });

  describe("\"social\" word", function() {
    it("Should not report any error for \"class\" attributes not containing \"social\"", async function() {
      const linter = createLinter();
      const html = "<div class=\"foo\">Foo</div>";

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for \"id\" attributes not containing \"social\"", async function() {
      const linter = createLinter();
      const html = "<div id=\"foo\">Foo</div>";

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for \"class\" attributes containing \"social\"", async function() {
      const linter = createLinter();
      const html = `
      <div class="social">Foo</div>
      <div class="my_social_class">Foo</div>
      `;

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(2);
    });

    it("Should report an error for \"id\" attributes containing \"social\"", async function() {
      const linter = createLinter();
      const html = `
      <div id="ad">Foo</div>
      <div id="my_social_id">Foo</div>
      `;

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(2);
    });

    it("Should not report any error for adjacent world", async function() {
      const linter = createLinter();
      const html = `
        <div class="socialize">Foo</div>
      `;

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(0);
    });
  });

  describe("\"banner\" word", function() {
    it("Should not report any error for \"class\" attributes not containing \"banner\"", async function() {
      const linter = createLinter();
      const html = "<div class=\"foo\">Foo</div>";

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for \"id\" attributes not containing \"banner\"", async function() {
      const linter = createLinter();
      const html = "<div id=\"foo\">Foo</div>";

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for \"class\" attributes containing \"banner\"", async function() {
      const linter = createLinter();
      const html = `
      <div class="banner">Foo</div>
      <div class="my_banner_class">Foo</div>
      `;

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(2);
    });

    it("Should report an error for \"id\" attributes containing \"banner\"", async function() {
      const linter = createLinter();
      const html = `
      <div id="ad">Foo</div>
      <div id="my_banner_id">Foo</div>
      `;

      const issues = await linter.lint(html, none, { "id-class-no-ad": true });
      expect(issues).to.have.lengthOf(2);
    });
  });

  it("Should not report any error for adjacent world", async function() {
    const linter = createLinter();
    const html = `
      <div class="bannerman">Foo</div>
    `;

    const issues = await linter.lint(html, none, { "id-class-no-ad": true });
    expect(issues).to.have.lengthOf(0);
  });
});
