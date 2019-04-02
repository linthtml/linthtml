const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require('../../../presets').presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("attr-name-style", function() {

  it("Should not report anything for correctly styled attribute names", function(done) {
    const linter = createLinter();
    const html = `<div abc="" fowj0wo3=""></div>`;
    linter.lint(html, none, { "attr-name-style": "lowercase" }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should ignore ignored attributes", function(done) {
    const linter = createLinter();
    const html = `<xml xlink:href=""></xml>`;
    linter.lint(html, none, { "attr-name-style": "dash", "attr-name-ignore-regex": "xlink:href" }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should not report anything when disabled", function(done) {
    const linter = createLinter();
    const html = `<div abc="" 2fOwj_0o-3=""></div>`;
    linter.lint(html, none, { "attr-name-style": false }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  describe("'lowercase' format", function() {
    it("Should not report an error for attributes with valid format", function(done) {
      const linter = createLinter();
      const html = `<div foo=""></div>`;
      linter.lint(html, none, { "attr-name-style": "lowercase" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      });
    });

    it("Should report an error for attributes with invalid format", function(done) {
      const linter = createLinter();
      const html = `<div FooBar="" foo-bar=""></div>`;
      linter.lint(html, none, { "attr-name-style": "lowercase" }).then((issues) => {
        expect(issues).to.have.lengthOf(2);
        done();
      });
    });
  });
  describe("'dash' format", function() {
    it("Should not report an error for attributes with valid format", function(done) {
      const linter = createLinter();
      const html = `<div foo-bar=""></div>`;
      linter.lint(html, none, { "attr-name-style": "dash" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      });
    });

    it("Should report an error for attributes with invalid format", function(done) {
      const linter = createLinter();
      const html = `<div FooBar="" foo_bar=""></div>`;
      linter.lint(html, none, { "attr-name-style": "dash" }).then((issues) => {
        expect(issues).to.have.lengthOf(2);
        done();
      });
    });
  });

  it("Should throw an error when an invalid config is passed", function() {

    const linter = createLinter();
    const html = `<button style="color: red;"></button>`;
    expect(() => linter.lint(html, none, { "attr-name-style": ["camel"]}))
      .to
      .throw(`Configuration for rule "attr-name-style" is invalid: Expected string or RegExp got object`);
  });


  describe("'regexp' format", function() {
    it("Should not report an error for attributes with valid format", function(done) {
      const linter = createLinter();
      const html = `<div foo=""></div>`;
      linter.lint(html, none, { "attr-name-style": /^[0-9a-o]+$/ }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      });
    });

    it("Should report an error for attributes with invalid format", function(done) {
      const linter = createLinter();
      const html = `<div bar></div>`;
      linter.lint(html, none, { "attr-name-style": /^[0-9a-o]+$/ }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      });
    });
  });
  describe("'camel' format", function() {


    it("Should not report an error for attributes with valid format", function(done) {
      const linter = createLinter();
      const html = `<div FooBar=""></div>`;
      linter.lint(html, none, { "attr-name-style": "camel" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      });
    });

    it("Should report an error for attributes with invalid format", function(done) {
      const linter = createLinter();
      const html = `<div foo-bar></div>`;
      linter.lint(html, none, { "attr-name-style": "camel" }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      });
    });
  });


});
// NOPE
//   {
//     desc: "should accept a string giving a RegExp",
//     input: '<div deadbeef1337="" fail="" fails=""></div>',
//     opts: { "attr-name-style": "/^[0-9a-f]+$/g" },
//     output: 2
//   }
// ];
