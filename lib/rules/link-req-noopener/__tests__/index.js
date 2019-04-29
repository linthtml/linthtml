const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("link-rel-noopener", function() {

  it(`Should not report any error when "target" does not equal "_blank"`, function(done) {
    const linter = createLinter();
    const html = `<a href="index.html">index</a>`;
    
    linter.lint(html, none, { "link-req-noopener": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it(`Should report an error when "target" equal "_blank" and "rel" attribut is undefined`, function(done) {
    const linter = createLinter();
    const html = `<a href="https://site.com" target="_blank">Site</a>`;
    
    linter.lint(html, none, { "link-req-noopener": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it(`Should report an error when "target" equal "_blank" and "rel" attribut is not equal to "noopener" or "noreferrer"`, function(done) {
    const linter = createLinter();
    const html = `<a href="https://site.com" target="_blank" rel="nofoloow">Site</a>`;
    
    linter.lint(html, none, { "link-req-noopener": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it(`Should report an error when "target" equal "_blank" and "rel" attribut equal "noopener"`, function(done) {
    const linter = createLinter();
    const html = `<a href="https://site.com" target="_blank" rel="noopener">Site</a>`;
    
    linter.lint(html, none, { "link-req-noopener": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it(`Should report an error when "target" equal "_blank" and "rel" attribut equal "noreferrer"`, function(done) {
    const linter = createLinter();
    const html = `<a href="https://site.com" target="_blank" rel="noreferrer">Site</a>`;
    
    linter.lint(html, none, { "link-req-noopener": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it(`Should report an error when "target" equal "_blank" and "rel" attribut equal "noreferrer" and "noopener"`, function(done) {
    const linter = createLinter();
    const html = `<a href="https://site.com" target="_blank" rel="noreferrer noopener">Site</a>`;
    
    linter.lint(html, none, { "link-req-noopener": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

});
