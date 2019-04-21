const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("class-no-dup", function() {

  it("Should not report an error when there's no duplicated classes", function(done) {
    const linter = createLinter();
    const html = `<div class="foo"></div>`;
    
    linter.lint(html, none, { "class-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report errors when there'‡s duplicated classes", function(done) {
    const linter = createLinter();
    const html = `<div class="foo foo"></div>`;
    
    linter.lint(html, none, { "class-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Should catch mutliple duplicates class", function(done) {
    const linter = createLinter();
    const html = `<div class="foo foo bar bar"></div>`;
    
    linter.lint(html, none, { "class-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    });
  });

  it("Should catch duplicates class even with leading and trailing whitespaces", function(done) {
    const linter = createLinter();
    const html = `<div class=" foo foo "></div>`;
    
    linter.lint(html, none, { "class-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });
});

describe("class-no-dup + id-class-ignore-regexp", function() {

  it("Should report errors for duplicates classes not matching a custom separator", function(done) {
    const linter = createLinter();
    const html = `<div class="foo foo"></div>`;
    
    linter.lint(html, none, { "class-no-dup": true, "id-class-ignore-regex": /^b/}).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Should no report errors for duplicates classes matching a custom separator", function(done) {
    const linter = createLinter();
    const html = `<div class="bar bar baz baz"></div>`;
    
    linter.lint(html, none, { "class-no-dup": true, "id-class-ignore-regex": /^b/}).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should not if `id-class-ignore-regex` contain a capturing group", function(done) {
    const linter = createLinter();
    const html = `<div class="bar bar baz baz"></div>`;
    
    linter.lint(html, none, { "class-no-dup": true, "id-class-ignore-regex": /^(b)/}).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });
});
