import InlineConfig from "../lib/legacy/inline_config";
import Config from "../lib/legacy/config";
import { expect } from "chai";

// TODO: Remove .default after typescript migration
import linthtml from "../lib";
import { presets } from "../lib/presets";
import { LegacyLinterConfig } from "../lib/read-config";

function createLinter(config: LegacyLinterConfig) {
  return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
}

const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hello, World!</title>
  </head>
  <body>
    <h1 id="heading">Heading</h1>
    <p>Paragraph</p>
    <div id="heading">
      <div role="supra">This inside that</div>
      <div class="ad">This inside that</div>
    </div>
  </body>
</html>
`;

describe("inline-configuration", function () {
  // Tests for inlineConfig internals
  // Should instantiate an object rather than using the prototype
  it("should throw when indices are passed to getOptsAtInex out of order", function () {
    expect(InlineConfig.prototype.getOptsAtIndex.bind(this, -10)).to.throw();
  });
  it("should throw when a config is added twice", function () {
    const c = new InlineConfig(new Config([]));
    c.addConfig({ end: 5 });
    expect(c.addConfig.bind(c, { end: 5 })).to.throw();
  });

  it("should not do anything if no inline config comments exist", async function () {
    const linter = createLinter({});
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  describe("linthml-configure instruction", function () {
    it("should not do anything on an empty tag", async function () {
      const linter = createLinter({});
      const html = "<!-- linthtml-configure -->";
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("should change options to turn off rules", async function () {
      const linter = createLinter({ "line-end-style": "crlf" });
      const html = [
        '<!-- linthtml-configure line-end-style="false" -->\r\n',
        "<body>\r\n",
        "  <p>\r\n",
        "    some text\r", // Should normaly report an error
        "  </p>\r\n",
        "</body>\r\n"
      ].join("");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("should work when used multiple times in a line ", async function () {
      const linter = createLinter({ "line-end-style": "crlf" });
      const html = [
        '<!-- linthtml-configure line-end-style="lf" --><!-- linthtml-configure line-end-style="false" -->\r\n',
        "<body>\n",
        "  <p>\r",
        "    some text\r",
        "  </p>\r",
        "</body>\r"
      ].join("");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
      // Should report 4 errors with "lf"
      // Should report 4 errors with "crlf"
    });

    it('Should revert to previous (previous) config using "$previous"', async function () {
      const linter = createLinter({ "line-end-style": "crlf" });
      const html = [
        '<!-- linthtml-configure line-end-style="false" --><!-- linthtml-configure line-end-style="$previous" -->\r\n',
        "<body>\n",
        "  <p>\r",
        "    some text\r",
        "  </p>\r",
        "</body>\r"
      ].join("");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(5);
    });

    it("quotes for values should not be mandatory", async function () {
      const linter = createLinter({ "line-end-style": "crlf" });
      const html = [
        "<!-- linthtml-configure line-end-style=false -->\r\n",
        "<body>\r\n",
        "  <p>\r\n",
        "    some text\r", // Should normaly report an error
        "  </p>\r\n",
        "</body>\r\n"
      ].join("");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("should work for strings without quotes", async function () {
      const linter = createLinter({ "line-end-style": "cr" });
      const html = [
        "<!-- linthtml-configure line-end-style=crlf -->\r",
        "<body>\r",
        "  <p>\r",
        "    some text\r",
        "  </p>\r",
        "</body>\r"
      ].join("");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(6);
    });

    // TODO: Should report only one error, parsing error
    it("Should throw an error on bad config formatting", function () {
      const linter = createLinter({});
      const html = '<!-- linthtml-configure id-no-dup-"false" -->';

      expect(() => linter.lint(html)).to.throw("Cannot parse inline configuration.");
    });

    it("should report an error for  nonexistent rule name", async function () {
      const linter = createLinter({});
      const html = '<!-- linthtml-configure id-no-no-ad="false"-->';

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("INLINE_02");
      expect((issues[0].data as any).rule_name).to.equal("id-no-no-ad");
    });

    it("Should report an error on invalid option value", async function () {
      const linter = createLinter({});
      const html = '<!-- linthtml-configure id-class-no-ad="fal#se"-->';

      // Should not report an error as it's a valid string
      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("INLINE_03");
    });

    it("should output an issue on invalid rule name", async function () {
      const linter = createLinter({});
      const html = '<!-- linthtml-configure pre#set="none" -->';

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E051");
    });

    it("should change multiple rules", async function () {
      const linter = createLinter({
        "line-end-style": "crlf",
        "id-no-dup": true,
        "id-class-no-ad": true
      });
      const html = [
        '<!-- linthtml-configure line-end-style="false" id-no-dup="false" id-class-no-ad="false" -->\r\n',
        '<body id="foo" class="ad-banner">\r',
        '  <p id="foo">\r',
        "    some text\r",
        "  </p>\r",
        "</body>\r"
      ].join("");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
      // Should report 7 errors normaly
    });
  });

  describe("linthml-(disable|enable) instruction", function () {
    it("instruction turn off rule when provided with the name", async function () {
      const linter = createLinter({ "line-end-style": "crlf" });
      const html = [
        "<!-- linthtml-disable line-end-style -->\r\n",
        "<body>\r\n",
        "  <p>\r\n",
        "    some text\r",
        "  </p>\r\n",
        "</body>\r\n"
      ].join("");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it('instruction can turn off multiple rules when names are separated using ","', async function () {
      const linter = createLinter({
        "indent-style": "tabs",
        "indent-width": 4
      });
      const html = [
        "<!-- linthtml-disable indent-style,indent-width -->",
        "<body>",
        "  <p>",
        "    some text",
        "  </p>",
        "</body>"
      ].join("\n");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it('instruction can turn off multiple rules when names are separated using "," (+spaces)', async function () {
      const linter = createLinter({
        "indent-style": "tabs",
        "indent-width": 4
      });
      const html = [
        "<!-- linthtml-disable indent-style , indent-width -->",
        "<body>",
        "  <p>",
        "    some text",
        "  </p>",
        "</body>"
      ].join("\n");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("instruction turn off all rules by default", async function () {
      const linter = createLinter({
        "indent-style": "tabs",
        "indent-width": 4
      });
      const html = ["<!-- linthtml-disable -->", "<body>", "  <p>", "    some text", "  </p>", "</body>"].join("\n");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("rules can be turned on again using the enable instruction", async function () {
      const linter = createLinter({
        "indent-style": "tabs",
        "indent-width": 4
      });
      const html = [
        "<!-- linthtml-disable -->",
        "<!-- linthtml-enable -->",
        "<body>",
        "  <p>",
        "    some text",
        "  </p>",
        "</body>"
      ].join("\n");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(2);
    });

    it("only one rules can be turned on again", async function () {
      const linter = createLinter({
        "indent-style": "tabs",
        "indent-width": 4
      });
      const html = [
        "<!-- linthtml-disable -->",
        "<!-- linthtml-enable indent-width -->",
        "<body>",
        "  <p>",
        "    some text",
        "  </p>",
        "</body>"
      ].join("\n");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
    });

    it("disable instructions report an error for nonexistent rule name", async function () {
      const linter = createLinter({});
      const html = "<!-- linthtml-disable id-no-no-ad-->";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("INLINE_02");
      expect((issues[0].data as any).rule_name).to.equal("id-no-no-ad");
    });

    it("enable instructions in report an error for nonexistent rule name", async function () {
      const linter = createLinter({});
      const html = "<!-- linthtml-disable id-no-no-ad-->";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("INLINE_02");
      expect((issues[0].data as any).rule_name).to.equal("id-no-no-ad");
    });

    it("enable instruction restore previous configuration", async function () {
      const linter = createLinter({
        "indent-style": "tabs",
        "indent-width": 4
      });
      const html = [
        "<!-- linthtml-disable -->",
        "<!-- linthtml-configure indent-width=2 -->",
        "<!-- linthtml-enable indent-width -->",
        "<body>",
        "  <p>",
        "    some text",
        "  </p>",
        "</body>"
      ].join("\n");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0); // no error as configuration instruction as change rule configuration on line 3
    });
  });
});
