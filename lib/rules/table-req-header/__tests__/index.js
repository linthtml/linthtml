const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("table-req-header", function() {

  it(`Should report an error when "<table>" does not have a "<thead>"`, function(done) {
    const linter = createLinter();
    const html = `<table></table>`;
    
    linter.lint(html, none, { "table-req-header": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it(`Should not report any error for "<table>" with a "<th>"`, function(done) {
    const linter = createLinter();
    const html = `<table><tr><th>Header></th></tr></table>`;
    
    linter.lint(html, none, { "table-req-header": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it(`Should not report any error for "<table>" with a "<th>" (not first child)`, function(done) {
    const linter = createLinter();
    const html = `<table><tr><td>Data</td><th>Header></th></tr></table>`;
    
    linter.lint(html, none, { "table-req-header": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it(`Should not report any error for "<table>" with a "<thead>"`, function(done) {
    const linter = createLinter();
    const html = `<table><thead>Header></thead></table>`;
    
    linter.lint(html, none, { "table-req-header": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it(`Should not report any error for "<table>" with a "<thead>" and text content before`, function(done) {
    const linter = createLinter();
    const html = `<table>text<thead>Header></thead></table>`;
    
    linter.lint(html, none, { "table-req-header": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it(`Should report an error when "<th>" not child of "<tr>"`, function(done) {
    const linter = createLinter();
    const html = `<table><th>Header></th></table>`;
    
    linter.lint(html, none, { "table-req-header": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it(`Should report an error when no "<th>" in first "<tr>"`, function(done) {
    const linter = createLinter();
    const html = `<table><tr><td>Data</td></tr><tr><th>Header</th></tr></table>`;
    
    linter.lint(html, none, { "table-req-header": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });
});
