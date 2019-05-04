const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("id-style", function() {

  it("Should not report any error for correctly formatted class", function(done) {
    const linter = createLinter();
    const html = `<div id="foo"></div>`;
    
    linter.lint(html, none, { "id-class-style": "lowercase" }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });


  describe("'lowercase' format", function() {
    it("Should not report an error for classes with valid format", function(done) {
      const linter = createLinter();
      const html = `<div id="foo"></div>`;
      linter.lint(html, none, { "id-class-style": "lowercase" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      });
    });

    it("Should report an error for classes with invalid format", function(done) {
      const linter = createLinter();
      const html = `<div id="bar-foo"></div>`;
      linter.lint(html, none, { "id-class-style": "lowercase" }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      });
    });
  });

  describe("'dash' format", function() {
    it("Should not report an error for classes with valid format", function(done) {
      const linter = createLinter();
      const html = `<div id="bar-foo"></div>`;
      linter.lint(html, none, { "id-class-style": "dash" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      });
    });

    it("Should report an error for classes with invalid format", function(done) {
      const linter = createLinter();
      const html = `<div id="BarFoo"></div>`;
      linter.lint(html, none, { "id-class-style": "dash" }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      });
    });
  });

  describe("'underscore' format", function() {
    it("Should not report an error for classes with valid format", function(done) {
      const linter = createLinter();
      const html = `<div id="bar_foo"></div>`;
      linter.lint(html, none, { "id-class-style": "underscore" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      });
    });

    it("Should report an error for classes with invalid format", function(done) {
      const linter = createLinter();
      const html = `<div id="BarFoo"></div>`;
      linter.lint(html, none, { "id-class-style": "underscore" }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      });
    });
  });

  describe("'BEM' format", function() {
    it("Should not report an error for classes with valid format", function(done) {
      const linter = createLinter();
      const html = `<div id="block__element"></div>`;
      linter.lint(html, none, { "id-class-style": "bem" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      });
    });

    it("Should report an error for classes with invalid format", function(done) {
      const linter = createLinter();
      const html = `<div id="block--modifier--modifier"></div>`;
      linter.lint(html, none, { "id-class-style": "bem" }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      });
    });
  });

  describe("'regexp' format", function() {
    it("Should not report an error for classes with valid format", function(done) {
      const linter = createLinter();
      const html = `<div id="foo-1"></div>`;
      linter.lint(html, none, { "id-class-style": /^foo-\d+$/ }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      });
    });

    it("Should report an error for classes with invalid format", function(done) {
      const linter = createLinter();
      const html = `<div id="bar-2"></div>`;
      linter.lint(html, none, { "id-class-style": /^foo-\d+$/ }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      });
    });
  });
  
  it("Should throw an error if `id-class-ignore-regex` is empty", function() {
    const linter = createLinter();
    const html = `<div id="bar-2"></div>`;

    expect(() => linter.lint(html, none, { "id-class-style": "dash", "id-class-ignore-regex": "" }))
      .to
      .throw(`Configuration for rule "id-class-ignore-regex" is invalid: You provide an empty string value`);
  });
});
