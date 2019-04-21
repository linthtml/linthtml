const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("class-style", function() {

  it("Should not report any error for correctly formatted class", function(done) {
    const linter = createLinter();
    const html = `<div class="foo"></div>`;
    
    linter.lint(html, none, { "class-style": "lowercase" }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });


  describe("'lowercase' format", function() {
    it("Should not report an error for classes with valid format", function(done) {
      const linter = createLinter();
      const html = `<div class="foo"></div>`;
      linter.lint(html, none, { "class-style": "lowercase" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      });
    });

    it("Should report an error for classes with invalid format", function(done) {
      const linter = createLinter();
      const html = `<div class="FOO bar-foo"></div>`;
      linter.lint(html, none, { "class-style": "lowercase" }).then((issues) => {
        expect(issues).to.have.lengthOf(2);
        done();
      });
    });
  });

  describe("'dash' format", function() {
    it("Should not report an error for classes with valid format", function(done) {
      const linter = createLinter();
      const html = `<div class="bar-foo"></div>`;
      linter.lint(html, none, { "class-style": "dash" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      });
    });

    it("Should report an error for classes with invalid format", function(done) {
      const linter = createLinter();
      const html = `<div class="BarFoo"></div>`;
      linter.lint(html, none, { "class-style": "dash" }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      });
    });
  });

  describe("'underscore' format", function() {
    it("Should not report an error for classes with valid format", function(done) {
      const linter = createLinter();
      const html = `<div class="bar_foo"></div>`;
      linter.lint(html, none, { "class-style": "underscore" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      });
    });

    it("Should report an error for classes with invalid format", function(done) {
      const linter = createLinter();
      const html = `<div class="BarFoo"></div>`;
      linter.lint(html, none, { "class-style": "underscore" }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      });
    });
  });

  describe("'BEM' format", function() {
    it("Should not report an error for classes with valid format", function(done) {
      const linter = createLinter();
      const html = `<div class="block__element block--modifier"></div>`;
      linter.lint(html, none, { "class-style": "bem" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      });
    });

    it("Should report an error for classes with invalid format", function(done) {
      const linter = createLinter();
      const html = `<div class="block--modifier--modifier block__element__element"></div>`;
      linter.lint(html, none, { "class-style": "bem" }).then((issues) => {
        expect(issues).to.have.lengthOf(2);
        done();
      });
    });
  });

  describe("'regexp' format", function() {
    it("Should not report an error for classes with valid format", function(done) {
      const linter = createLinter();
      const html = `<div class="foo-1"></div>`;
      linter.lint(html, none, { "class-style": /^foo-\d+$/ }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      });
    });

    it("Should report an error for classes with invalid format", function(done) {
      const linter = createLinter();
      const html = `<div class="bar-2"></div>`;
      linter.lint(html, none, { "class-style": /^foo-\d+$/ }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      });
    });
  });
  
  it("Should fallback to `id-class-style` if `class-style` is false", function(done) {
    
    const linter = createLinter();
    const html = `<div class="FOO bar-foo"></div>`;
    linter.lint(html, none, { "class-style": false, "id-class-style": "lowercase" }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    });
  });
  
  it("Should not fallback to `id-class-style` if `class-style` is set to `none`", function(done) {
    
    const linter = createLinter();
    const html = `<div class="FOO bar-foo"></div>`;
    linter.lint(html, none, { "class-style": "none", "id-class-style": "lowercase" }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });
  
  it("Should throw an error if `id-class-ignore-regex` is empty", function() {
    const linter = createLinter();
    const html = `<div class="bar-2"></div>`;

    expect(() => linter.lint(html, none, { "class-style": "dash", "id-class-ignore-regex": "" }))
      .to
      .throw(`Configuration for rule "id-class-ignore-regex" is invalid: You provide an empty string value`);
  });
});
