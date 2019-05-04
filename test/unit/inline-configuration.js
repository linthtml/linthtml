const InlineConfig = require("../../lib/inline_config.js");
const { expect } = require("chai");

const linthtml = require("../../lib");
const none = require('../../lib/presets').presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
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

  it("should not do anything if no inline config comments exist", function(done) {
    const linter = createLinter();
    linter.lint(html, none, { }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("should not do anything on an empty tag", function(done) {
    const linter = createLinter();
    const html = "<!-- linthtml-configure -->";
    linter.lint(html, none, { }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("should change options to turn off rules", function(done) {
    const linter = createLinter();
    const html = [
      `<!-- linthtml-configure line-end-style="false" -->\r\n`,
      "<body>\r\n",
      "  <p>\r\n",
      "    some text\r", // Should normaly report an error
      "  </p>\r\n",
      "</body>\r\n"
    ].join("");
    
    linter.lint(html, none, { "line-end-style": "crlf" }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("should accept $preset notation", function(done) {
    const linter = createLinter();
    const html = [
      `<!-- linthtml-configure line-end-style="$none"  -->\r\n`,
      "<body>\r\n",
      "  <p>\r\n",
      "    some text\r", // Should normaly report an error
      "  </p>\r\n",
      "</body>\r\n"
    ].join("");
    
    linter.lint(html, none, { "line-end-style": "crlf" }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("should work when used multiple times in a line ", function(done) {
    const linter = createLinter();
    const html = [
      `<!-- linthtml-configure line-end-style="lf" --><!-- linthtml-configure line-end-style="false" -->\r\n`,
      "<body>\n",
      "  <p>\r",
      "    some text\r",
      "  </p>\r",
      "</body>\r"
    ].join("");
    
    linter.lint(html, none, { "line-end-style": "crlf" }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      // Should report 4 errors with "lf"
      // Should report 4 errors with "crlf"
      done();
    });
  });

  it(`Should revert to previous (previous) config using "$previous"`, function(done) {
    const linter = createLinter();
    const html = [
      `<!-- linthtml-configure line-end-style="false" --><!-- linthtml-configure line-end-style="$previous" -->\r\n`,
      "<body>\n",
      "  <p>\r",
      "    some text\r",
      "  </p>\r",
      "</body>\r"
    ].join("");
    
    linter.lint(html, none, { "line-end-style": "crlf" }).then((issues) => {
      expect(issues).to.have.lengthOf(5);
      done();
    });
  });

  it("quotes for valuese should not be mandatory", function(done) {
    const linter = createLinter();
    const html = [
      `<!-- linthtml-configure line-end-style=false -->\r\n`,
      "<body>\r\n",
      "  <p>\r\n",
      "    some text\r", // Should normaly report an error
      "  </p>\r\n",
      "</body>\r\n"
    ].join("");
    
    linter.lint(html, none, { "line-end-style": "crlf" }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("should work for strings without quotes", function(done) {
    const linter = createLinter();
    const html = [
      `<!-- linthtml-configure line-end-style=crlf -->\r`,
      "<body>\r",
      "  <p>\r",
      "    some text\r",
      "  </p>\r",
      "</body>\r"
    ].join("");
    
    linter.lint(html, none, { "line-end-style": "cr" }).then((issues) => {
      expect(issues).to.have.lengthOf(5);
      done();
    });
  });

  // TODO: Should report only one error, parsing error
  it("Shoul output an error on bad config formatting", function(done) {
    const linter = createLinter();
    const html = `<!-- linthtml-configure id-no-dup-"false"   -->`;
  
    linter.lint(html, none, {}).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      expect(issues[0].code).to.equal("E050");
      expect(issues[1].code).to.equal("E050");
      done();
    });
  });

  it("should throw an error for  nonexistent rule name", function(done) {
    const linter = createLinter();
    const html = `<!-- linthtml-configure id-no-no-ad="false"-->`;
  
    linter.lint(html, none, {}).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E054");
      done();
    });
  });

  it("should output an issue on invalid option value", function(done) {
    const linter = createLinter();
    const html = `<!-- linthtml-configure id-class-no-ad="fal#se"-->`;
  
    linter.lint(html, none, {}).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E053");
      done();
    });
  });

  it("should output an issue on invalid rule name", function(done) {
    const linter = createLinter();
    const html = `<!-- linthtml-configure pre#set="none" -->`;
  
    linter.lint(html, none, {}).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E051");
      done();
    });
  });

  it("should change multiple rules", function(done) {
    const linter = createLinter();
    const html = [
      `<!-- linthtml-configure line-end-style="false" id-no-dup="false" id-class-no-ad="false" -->\r\n`,
      `<body id="foo" class="ad-banner">\r`,
      `  <p id="foo">\r`,
      "    some text\r",
      "  </p>\r",
      "</body>\r"
    ].join("");
    
    linter.lint(html, none, { "line-end-style": "crlf", "id-no-dup": true, "id-class-no-ad": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      // Should report 7 errors normaly
      done();
    });
  });

  it("should take in presets", function(done) {
    const linter = createLinter();
    const html = `<!-- linthtml-configure preset="none" -->`;
    
    linter.lint(html, none, { }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      // Should report 7 errors normaly
      done();
    });
  });

  it(`should revert last setting usign "$previous" preset`, function(done) {
      const linter = createLinter();
      const html = [
        '<!-- linthtml-configure line-end-style="false" --> <!-- linthtml-configure id-no-dup="false" id-class-no-ad="false" --> <!-- linthtml-configure preset="$previous" -->\r\n',
        `<body id="foo" class="ad-banner">\r`,
        `  <p id="foo">\r`,
        "    some text\r",
        "  </p>\r",
        "</body>\r"
      ].join("");
      
      linter.lint(html, none, { "line-end-style": "crlf", "id-no-dup": true, "id-class-no-ad": true }).then((issues) => {
        expect(issues).to.have.lengthOf(2);
        expect(issues[0].code).to.equal("E010");
        expect(issues[1].code).to.equal("E012");
        done();
      });
  });

  it("should revert an entire preset with preset=$previous", function(done) {
    const linter = createLinter();
    const html = [
      '<!-- linthtml-configure preset="none" --> <!-- linthtml-configure preset="$previous" -->\r\n',
      `<body id="foo" class="ad-banner">\r`,
      `  <p id="foo">\r`,
      "    some text\r",
      "  </p>\r",
      "</body>\r"
    ].join("");
    
    linter.lint(html, none, { "line-end-style": "crlf", "id-no-dup": true, "id-class-no-ad": true }).then((issues) => {
      expect(issues).to.have.lengthOf(7);
      expect(issues[0].code).to.equal("E015");
      expect(issues[1].code).to.equal("E015");
      expect(issues[2].code).to.equal("E015");
      expect(issues[3].code).to.equal("E015");
      expect(issues[4].code).to.equal("E015");
      expect(issues[5].code).to.equal("E010");
      expect(issues[6].code).to.equal("E012");
      done();
    });
  });

  it("should output an issue on invalid $preset", function(done) {
    const linter = createLinter();
    const html = `<!-- linthtml-configure line-end-style="$invalid" -->`;
  
    linter.lint(html, none, {}).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E052");
      done();
    });
  });

  it("should output an issue on invalid preset option", function(done) {
    const linter = createLinter();
    const html = `<!-- linthtml-configure preset="invalid" -->`;
  
    linter.lint(html, none, {}).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E052");
      done();
    });
  });
});
