const InlineConfig = require("../../lib/legacy/inline_config");
const { expect } = require("chai");

const linthtml = require("../../lib");
const none = require('../../lib/presets').presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
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

describe("inline-configuration", function() {

  // Tests for inlineConfig internals
  // Should instantiate an object rather than using the prototype
  it("should throw when indices are passed to getOptsAtInex out of order", function() {
    expect(InlineConfig.prototype.getOptsAtIndex.bind(this, -10)).to.throw();
  });
  it("should throw when a config is added twice", function() {
    var c = new InlineConfig({
      setOption: function(o) {
        return o;
      }
    });
    c.addConfig({ end: 5 });
    expect(c.addConfig.bind(c, { end: 5 })).to.throw();
  });

  it("should not do anything if no inline config comments exist", async function() {
    const linter = createLinter();
    const issues = await linter.lint(html, none, { });
    expect(issues).to.have.lengthOf(0);
  });

  it("should not do anything on an empty tag", async function() {
    const linter = createLinter();
    const html = "<!-- linthtml-configure -->";
    const issues = await linter.lint(html, none, { });
    expect(issues).to.have.lengthOf(0);
  });

  it("should change options to turn off rules", async function() {
    const linter = createLinter();
    const html = [
      `<!-- linthtml-configure line-end-style="false" -->\r\n`,
      "<body>\r\n",
      "  <p>\r\n",
      "    some text\r", // Should normaly report an error
      "  </p>\r\n",
      "</body>\r\n"
    ].join("");
    
    const issues = await linter.lint(html, none, { "line-end-style": "crlf" });
    expect(issues).to.have.lengthOf(0);
  });

  it("should accept $preset notation", async function() {
    const linter = createLinter();
    const html = [
      `<!-- linthtml-configure line-end-style="$none"  -->\r\n`,
      "<body>\r\n",
      "  <p>\r\n",
      "    some text\r", // Should normaly report an error
      "  </p>\r\n",
      "</body>\r\n"
    ].join("");
    
    const issues = await linter.lint(html, none, { "line-end-style": "crlf" });
    expect(issues).to.have.lengthOf(0);
  });

  it("should work when used multiple times in a line ", async function() {
    const linter = createLinter();
    const html = [
      `<!-- linthtml-configure line-end-style="lf" --><!-- linthtml-configure line-end-style="false" -->\r\n`,
      "<body>\n",
      "  <p>\r",
      "    some text\r",
      "  </p>\r",
      "</body>\r"
    ].join("");
    
    const issues = await linter.lint(html, none, { "line-end-style": "crlf" });
    expect(issues).to.have.lengthOf(0);
      // Should report 4 errors with "lf"
      // Should report 4 errors with "crlf"
  });

  it(`Should revert to previous (previous) config using "$previous"`, async function() {
    const linter = createLinter();
    const html = [
      `<!-- linthtml-configure line-end-style="false" --><!-- linthtml-configure line-end-style="$previous" -->\r\n`,
      "<body>\n",
      "  <p>\r",
      "    some text\r",
      "  </p>\r",
      "</body>\r"
    ].join("");
    
    const issues = await linter.lint(html, none, { "line-end-style": "crlf" });
    expect(issues).to.have.lengthOf(5);
  });

  it("quotes for valuese should not be mandatory", async function() {
    const linter = createLinter();
    const html = [
      `<!-- linthtml-configure line-end-style=false -->\r\n`,
      "<body>\r\n",
      "  <p>\r\n",
      "    some text\r", // Should normaly report an error
      "  </p>\r\n",
      "</body>\r\n"
    ].join("");
    
    const issues = await linter.lint(html, none, { "line-end-style": "crlf" });
    expect(issues).to.have.lengthOf(0);
  });

  it("should work for strings without quotes", async function() {
    const linter = createLinter();
    const html = [
      `<!-- linthtml-configure line-end-style=crlf -->\r`,
      "<body>\r",
      "  <p>\r",
      "    some text\r",
      "  </p>\r",
      "</body>\r"
    ].join("");
    
    const issues = await linter.lint(html, none, { "line-end-style": "cr" });
    expect(issues).to.have.lengthOf(5);
  });

  // TODO: Should report only one error, parsing error
  it("Should throw an error on bad config formatting", function() {
    const linter = createLinter();
    const html = `<!-- linthtml-configure id-no-dup-"false"   -->`;
  
    expect(() => linter.lint(html, none, {}))
      .to
      .throw('Cannot parse inline configuration.');
  });

  it("should throw an error for  nonexistent rule name", async function() {
    const linter = createLinter();
    const html = `<!-- linthtml-configure id-no-no-ad="false"-->`;
  
    const issues = await linter.lint(html, none, {});
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].code).to.equal("E054");
  });

  it("Should throw an error on invalid option value", function() {
    const linter = createLinter();
    const html = `<!-- linthtml-configure id-class-no-ad="fal#se"-->`;
  
    expect(() => linter.lint(html, none, {}))
      .to
      .throw(`Inline configuration for rule "id-class-no-ad" cannot be parsed.`);
  });

  it("should output an issue on invalid rule name", async function() {
    const linter = createLinter();
    const html = `<!-- linthtml-configure pre#set="none" -->`;
  
    const issues = await linter.lint(html, none, {});
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].code).to.equal("E051");
  });

  it("should change multiple rules", async function() {
    const linter = createLinter();
    const html = [
      `<!-- linthtml-configure line-end-style="false" id-no-dup="false" id-class-no-ad="false" -->\r\n`,
      `<body id="foo" class="ad-banner">\r`,
      `  <p id="foo">\r`,
      "    some text\r",
      "  </p>\r",
      "</body>\r"
    ].join("");
    
    const issues = await linter.lint(html, none, { "line-end-style": "crlf", "id-no-dup": true, "id-class-no-ad": true });
    expect(issues).to.have.lengthOf(0);
    // Should report 7 errors normaly
  });

  it("should take in presets", async function() {
    const linter = createLinter();
    const html = `<!-- linthtml-configure preset="none" -->`;
    
    const issues = await linter.lint(html, none, { });
    expect(issues).to.have.lengthOf(0);
    // Should report 7 errors normaly
  });

  it(`should revert last setting usign "$previous" preset`, async function() {
    const linter = createLinter();
    const html = [
      '<!-- linthtml-configure line-end-style="false" --> <!-- linthtml-configure id-no-dup="false" id-class-no-ad="false" --> <!-- linthtml-configure preset="$previous" -->\r\n',
      `<body id="foo" class="ad-banner">\r`,
      `  <p id="foo">\r`,
      "    some text\r",
      "  </p>\r",
      "</body>\r"
    ].join("");
    
    const issues = await linter.lint(html, none, { "line-end-style": "crlf", "id-no-dup": true, "id-class-no-ad": true });
    expect(issues).to.have.lengthOf(2);
    expect(issues[0].code).to.equal("E010");
    expect(issues[1].code).to.equal("E012");
  });

  it("should revert an entire preset with preset=$previous", async function() {
    const linter = createLinter();
    const html = [
      '<!-- linthtml-configure preset="none" --> <!-- linthtml-configure preset="$previous" -->\r\n',
      `<body id="foo" class="ad-banner">\r`,
      `  <p id="foo">\r`,
      "    some text\r",
      "  </p>\r",
      "</body>\r"
    ].join("");
    
    const issues = await linter.lint(html, none, { "line-end-style": "crlf", "id-no-dup": true, "id-class-no-ad": true });
    expect(issues).to.have.lengthOf(7);
    expect(issues[0].code).to.equal("E015");
    expect(issues[1].code).to.equal("E015");
    expect(issues[2].code).to.equal("E015");
    expect(issues[3].code).to.equal("E015");
    expect(issues[4].code).to.equal("E015");
    expect(issues[5].code).to.equal("E010");
    expect(issues[6].code).to.equal("E012");
  });

  it("should output an issue on invalid $preset", async function() {
    const linter = createLinter();
    const html = `<!-- linthtml-configure line-end-style="$invalid" -->`;
  
    const issues = await linter.lint(html, none, {});
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].code).to.equal("E052");
  });

  it("should output an issue on invalid preset option", async function() {
    const linter = createLinter();
    const html = `<!-- linthtml-configure preset="invalid" -->`;
  
    const issues = await linter.lint(html, none, {});
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].code).to.equal("E052");
  });
});
