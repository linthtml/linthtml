const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("href-style", function() {
  describe(`"absolute" mode`, function() {

    it("Should not report any error for absolute links", function(done) {
      const linter = createLinter();
      const html = `<a href="http://www.google.com">A link</a>`;
      
      linter.lint(html, none, { "href-style": "absolute" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });

    it("Should report an error for relative links", function(done) {
      const linter = createLinter();
      const html = `<a href="/foo">A link</a>`;
      
      linter.lint(html, none, { "href-style": "absolute" }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      }); 
    });

    it("Should not report any error for empty links", function(done) {
      const linter = createLinter();
      const html = `<a>A link</a>`;
      
      linter.lint(html, none, { "href-style": "absolute" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });

    it("Should not report any error for fragment only links", function(done) {
      const linter = createLinter();
      const html = `<a href="#bar">A link</a>`;
      
      linter.lint(html, none, { "href-style": "absolute" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });
  });
  describe(`"relative" mode`, function() {

    it("Should not report any error for relative links", function(done) {
      const linter = createLinter();
      const html = `<a href="/foo">A link</a>`;
      
      linter.lint(html, none, { "href-style": "relative" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });

    it("Should report an error for absolute links", function(done) {
      const linter = createLinter();
      const html = `<a href="http://www.google.com">A link</a>`;
      
      linter.lint(html, none, { "href-style": "relative" }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      }); 
    });

    it("Should not report any error for empty links", function(done) {
      const linter = createLinter();
      const html = `<a>A link</a>`;
      
      linter.lint(html, none, { "href-style": "relative" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });

    it("Should not report any error for fragment only links", function(done) {
      const linter = createLinter();
      const html = `<a href="#bar">A link</a>`;
      
      linter.lint(html, none, { "href-style": "relative" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });
  });
});
