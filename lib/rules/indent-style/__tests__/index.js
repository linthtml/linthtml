const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("indent-style", function() {
  describe(`"tabs" style`, function() {
    it("Should not report any error for tab indent", function(done) {
      const linter = createLinter();
      const html = `<div>\n\t<p>foo</p>\n</div>`;
      
      linter.lint(html, none, { "indent-style": "tabs" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });

    it("Should report an error for space indent", function(done) {
      const linter = createLinter();
      const html = `<div>\n <p>foo</p>\n</div>`;
      
      linter.lint(html, none, { "indent-style": "tabs" }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      }); 
    });
  });

  describe(`"spaces" style`, function() {
    it("Should not report any error for space indent", function(done) {
      const linter = createLinter();
      const html = `<div>\n <p>foo</p>\n</div>`;
      
      linter.lint(html, none, { "indent-style": "spaces" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });

    it("Should report an error for tab indent", function(done) {
      const linter = createLinter();
      const html = `<div>\n\t<p>foo</p>\n</div>`;
      
      linter.lint(html, none, { "indent-style": "spaces" }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      }); 
    });
  });

  describe(`"nonmixed" style`, function() {
    it("Should not report any error for space indent", function(done) {
      const linter = createLinter();
      const html = `<div>\n <p>foo</p>\n</div>`;
      
      linter.lint(html, none, { "indent-style": "nonmixed" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });

    it("Should not report any error for tab indent", function(done) {
      const linter = createLinter();
      const html = `<div>\n\t<p>foo</p>\n</div>`;
      
      linter.lint(html, none, { "indent-style": "nonmixed" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });

    it("Should report an error when tabs and spaces are mixed on the same line", function(done) {
      const linter = createLinter();
      const html = `<div>\n\t <p>foo</p>\n</div>`;
      
      linter.lint(html, none, { "indent-style": "nonmixed" }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      }); 
    });
  });

  it("Should throw an error if not given a string as config", function() {
    const linter = createLinter();
    const html = ``;
    expect(() => linter.lint(html, none, { "indent-style": true }))
      .to
      .throw(`Configuration for rule "indent-style" is invalid: Expected string got boolean`);
  });

  it("Should throw an error if not given a valid string as config", function() {
    const linter = createLinter();
    const html = ``;
    expect(() => linter.lint(html, none, { "indent-style": "foo" }))
      .to
      .throw(`Configuration for rule "indent-style" is invalid: Indent style "foo" is not valid. Valid indent styles are "tabs", "spaces" and "nonmixed"`);
  });
});

describe(`"ident-style" + "indent-width"`, function() {
  describe(`"tabs" style`, function() {
    it("Should not report any error when the correct number of tabs is used", function(done) {
      const linter = createLinter();
      const html = `<div>\n\t<p>foo</p>\n</div>`;
      
      linter.lint(html, none, { "indent-style": "tabs", "indent-width": 1 }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });

    it("Should report an error when an incorrect number of tabs is used (to many)", function(done) {
      const linter = createLinter();
      const html = `<div>\n\t\t<p>foo\n</p>\n</div>`;
      
      linter.lint(html, none, { "indent-style": "tabs", "indent-width": 1 }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      }); 
    });

    it("Should report an error when an incorrect number of tabs is used (not enought)", function(done) {
      const linter = createLinter();
      const html = `<div>\n\t<p>foo\n</p>\n</div>`;
      
      linter.lint(html, none, { "indent-style": "tabs", "indent-width": 2 }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      }); 
    });
  });

  describe(`"spaces" style`, function() {
    it("Should not report any error when the correct number of spaces is used", function(done) {
      const linter = createLinter();
      const html = `<div>\n  <p>foo</p>\n</div>`;
      
      linter.lint(html, none, { "indent-style": "spaces", "indent-width": 2 }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });

    it("Should report an error when an incorrect number of spaces is used (to many)", function(done) {
      const linter = createLinter();
      const html = `<div>\n  <p>foo\n</p>\n</div>`;
      
      linter.lint(html, none, { "indent-style": "spaces", "indent-width": 1 }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      }); 
    });

    it("Should report an error when an incorrect number of spaces is used (not enought)", function(done) {
      const linter = createLinter();
      const html = `<div>\n <p>foo\n</p>\n</div>`;
      
      linter.lint(html, none, { "indent-style": "spaces", "indent-width": 2 }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      }); 
    });
  });

  it("Should throw an error if not given a number as config", function() {
    const linter = createLinter();
    const html = ``;
    expect(() => linter.lint(html, none, { "indent-width": "foo" }))
      .to
      .throw(`Configuration for rule "indent-width" is invalid: Expected number got string`);
  });

  it("Should throw an error if not given a positive number as config", function() {
    const linter = createLinter();
    const html = ``;
    expect(() => linter.lint(html, none, { "indent-width": -1 }))
      .to
      .throw(`Configuration for rule "indent-width" is invalid: Only positive indent value are allowed`);
  });
});
