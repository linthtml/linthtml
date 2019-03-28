const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require('../../../presets').presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("attr-bans", function() {
  it("Should not report an error for a tag named 'style'", function(done) {
    const linter = createLinter();
    const html = "<body><style>hello</style></body>";
    linter.lint(html, none, { "attr-bans": ["style"] }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });
  it("Should not report anything when disabled", function(done) {
    const linter = createLinter();
    const html = `<button style="color: red;"></button>`;
    linter.lint(html, none, { "attr-bans": false }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should accept a single string as option", function(done) {
    const linter = createLinter();
    const html = `<button style="color: red;"></button>`;
    linter.lint(html, none, { "attr-bans": "style" }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Banned attributes should be case insensitive", function (done) {

    const linter = createLinter();
    const html = `<body ban0 ban1>`;
    linter.lint(html, none, { "attr-bans": ["ban0", "bAN1"] }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    });
  });

  it('Should accept regexes as config', function(done) {
    const linter = createLinter();
    const html="<div onClick='' onfocus='' noop=''></div>";
    linter.lint(html, none, { "attr-bans": [/on\w+/i] }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    });
  });
    
  it("Should throw an error for an invalid config", function() {
    const linter = createLinter();
    const html = `<button style="color: red;"></button>`;
    expect(() => linter.lint(html, none, { "attr-bans": true }))
      .to
      .throw(`Configuration for rule "attr-bans" is invalid: Expected string, RegExp or (string|RegExp)[] got boolean`);
  });

  it("Should throw an error if not given a list of strings as config", function() {
    const linter = createLinter();
    const html = `<button style="color: red;"></button>`;
    expect(() => linter.lint(html, none, { "attr-bans": ["string", true] }))
      .to
      .throw(`Configuration for rule "attr-bans" is invalid: Expected string, RegExp or (string|RegExp)[] got boolean[]`);
  });
  
  it("Should report an error when the 'style' attribute is present", function(done) {
    const linter = createLinter();
    const html = `<button style="color: red;"></button>`;
    linter.lint(html, none, { "attr-bans": ["style"] }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });
});
