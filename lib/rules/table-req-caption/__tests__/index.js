const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("table-req-caption", function() {

  it(`Should report an error when "<table>" does not have a "<caption>"`, function(done) {
    const linter = createLinter();
    const html = `<table></table>`;
    
    linter.lint(html, none, { "table-req-caption": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it(`Should report an error when "<caption>" is not a child of "<table>"`, function(done) {
    const linter = createLinter();
    const html = `<table><td><caption>Hello</caption></td></table>`;
    
    linter.lint(html, none, { "table-req-caption": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it(`Should report an error when "<caption>" is a sibling of "<table>"`, function(done) {
    const linter = createLinter();
    const html = `<table></table><caption>Hello</caption>`;
    
    linter.lint(html, none, { "table-req-caption": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it(`Should report as many error as "<table>" without "<caption>"`, function(done) {
    const linter = createLinter();
    const html = `<table></table><table></table>`;
    
    linter.lint(html, none, { "table-req-caption": true }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    }); 
  });

  it(`Should not report any error for "<table>" with "<caption>"`, function(done) {
    const linter = createLinter();
    const html = `<table><caption>Caption></table><table><td></td><td></td><caption>Caption</caption></table>`;
    
    linter.lint(html, none, { "table-req-caption": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });
});
