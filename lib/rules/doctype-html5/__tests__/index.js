const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("doctype-html5", function() {
  
  it("Should not report any error for a valid html5 DOCTYPE", function(done) {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
    `;
    
    linter.lint(html, none, { "doctype-html5": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report an error when DOCTYPE is not for html5", function(done) {
    const linter = createLinter();
    const html = `
      <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n"http://www.w3.org/TR/html4/strict.dtd">
    `;
    
    linter.lint(html, none, { "doctype-html5": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should report an error given a legacy doctype", function(done) {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html SYSTEM "about:legacy-compat">
    `;
    
    linter.lint(html, none, { "doctype-html5": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should not report an error", function(done) {
    const linter = createLinter();
    const html = `
      <!random g">
    `;
    
    linter.lint(html, none, { "doctype-html5": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });
});
