const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("head-req-title", function() {

  it("Should not report any error when the head title is present", function(done) {
    const linter = createLinter();
    const html = `
    <html>
      <head>
        <title>Title!</title>
      </head>
    </html>
    `;
    
    linter.lint(html, none, { "head-req-title": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report an error when the head title is not present", function(done) {
    const linter = createLinter();
    const html = `
    <html>
      <head>
      </head>
    </html>
    `;
    
    linter.lint(html, none, { "head-req-title": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should report an error when the head title is empty", function(done) {
    const linter = createLinter();
    const html = `
    <html>
      <head>
        <title></title>
      </head>
    </html>
    `;
    
    linter.lint(html, none, { "head-req-title": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  describe("Multiple <title>", function() {
    it("Should not report any error when one title is not empty", function(done) {
      const linter = createLinter();
      const html = `
      <html>
        <head>
          <title></title>
          <title>Foo</title>
        </head>
      </html>
      `;
      
      linter.lint(html, none, { "head-req-title": true }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });

    it("Should report any errors when all titles are empty", function(done) {
      const linter = createLinter();
      const html = `
      <html>
        <head>
          <title></title>
          <title></title>
        </head>
      </html>
      `;
      
      linter.lint(html, none, { "head-req-title": true }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      }); 
    });

  });

});
