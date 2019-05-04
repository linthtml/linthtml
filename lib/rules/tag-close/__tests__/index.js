const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require('../../../presets').presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("tag-close", function() {
  it("Should not report an error for matching open/close tags", function(done) {
    const linter = createLinter();
    const html = "<body></body><Div></Div>";
    linter.lint(html, none, { "tag-name-match": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should report an error for not matching open/close tags", function(done) {
    const linter = createLinter();
    const html = "<body></div>";
    linter.lint(html, none, { "tag-close": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Should report an error for not matching open/close tags (different case)", function(done) {
    const linter = createLinter();
    const html = "<body></Body>";
    linter.lint(html, none, { "tag-name-match": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Should report an error per none matching open/close tags", function(done) {
    const linter = createLinter();
    const html = "<body><p></span></div>";
    linter.lint(html, none, { "tag-close": true }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    });
  });

  it(`Should report an error for not closed self closed tags when "tag-self-close" is set to "always"`, function(done) {
    const linter = createLinter();
    const html = "<img>";
    linter.lint(html, none, { "tag-self-close": "always" }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it(`Should not report an error for closed self closed tags when "tag-self-close" is set to "always"`, function(done) {
    const linter = createLinter();
    const html = "<img/>";
    linter.lint(html, none, { "tag-self-close": "always" }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it(`Should report an error for closed self closed tags when "tag-self-close" is set to "never"`, function(done) {
    const linter = createLinter();
    const html = "<img>";
    linter.lint(html, none, { "tag-self-close": "never" }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it(`Should not report an error for not closed self closed tags when "tag-self-close" is set to "never"`, function(done) {
    const linter = createLinter();
    const html = "<img/>";
    linter.lint(html, none, { "tag-self-close": "never" }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Should not report an error for self closing tags", function(done) {
    const linter = createLinter();
    const html = "<br/><br>";
    linter.lint(html, none, { "tag-close": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should throw an error for an invalid config", function() {
    const linter = createLinter();
    const html = `<button"></button>`;
    expect(() => linter.lint(html, none, { "tag-self-close": true }))
      .to
      .throw(`Configuration for rule "tag-self-close" is invalid: Expected string got boolean`);
  });

  it("Should throw an error if not given a list of strings as config", function() {
    const linter = createLinter();
    const html = `<button></button>`;
    expect(() => linter.lint(html, none, { "tag-self-close": "foo" }))
      .to
      .throw(`Configuration for rule "tag-self-close" is invalid: "foo" is not accepted. Accepted values are "always" and "never".`);
  });
});
