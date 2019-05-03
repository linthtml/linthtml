const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require('../../../presets').presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("attr-no-dup", function() {

  it("Should not report an error when an attribut is not duplicated", function(done) {
    const linter = createLinter();
    const html = `<div class="foo"></div>`;
    
    linter.lint(html, none, { "attr-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should report an error when an attribut is duplicated", function(done) {
    const linter = createLinter();
    const html = `<div class="foo" class="foo"></div>`;
    
    linter.lint(html, none, { "attr-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Should catch multiple duplicates in one element", function(done) {
    const linter = createLinter();
    const html = `<div class="foo" class="foo" id="bar" id="bar"></div>`;
    
    linter.lint(html, none, { "attr-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    });
  });

  it("Should catch duplicates on multiple elements", function(done) {
    const linter = createLinter();
    const html = "<div class='foo' class='foo'><p id='bar' id='bar'>Text</p></div>";
 
    linter.lint(html, none, { "attr-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    });
  });

  it("Should be case insensitive", function(done) {
    const linter = createLinter();
    const html = "<div class='foo' Class='foo'></div>";
 
    linter.lint(html, none, { "attr-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Should throw an error when an invalid config is provided", function() {
    const linter = createLinter();
    const html = `
      <div
        class="foo"
        id>
      </div>
    `;
    expect(() => linter.lint(html, none, { "attr-no-dup": "toto" }))
      .to
      .throw(`Configuration for rule "attr-no-dup" is invalid: Expected boolean got string`);
  });
 
});
