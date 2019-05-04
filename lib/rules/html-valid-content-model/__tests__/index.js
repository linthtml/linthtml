const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("html-valid-content-model", function() {
  it("Should report an error for every invalid child", function(done) {
    const linter = createLinter();
    const html = `
      <html>
        <head></head>
        <div>A div</div>
        <p>A paragraph</p>
        <button>A button</button>
      </html>
    `;
    
    linter.lint(html, none, { "html-valid-content-model": true }).then((issues) => {
      expect(issues).to.have.lengthOf(3);
      done();
    }); 
  });

  it("Should not report any error when <html> is missing", function(done) {
    const linter = createLinter();
    const html = `
      <head></head>
      <div>A div</div>
      <p>A paragraph</p>
      <button>A button</button>
      <body></body>
    `;
    
    linter.lint(html, none, { "html-valid-content-model": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should not report any error when <head> and <body> are in the correct order", function(done) {
    const linter = createLinter();
    const html = `
      <html>
        <head></head>
        <body></body>
      </html>
    `;
    
    linter.lint(html, none, { "html-valid-content-model": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report an error when <head> and <body> are not in the correct order", function(done) {
    const linter = createLinter();
    const html = `
      <html>
        <body></body>
        <head></head>
      </html>
    `;
    
    linter.lint(html, none, { "html-valid-content-model": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should accept only one <head> as child", function(done) {
    const linter = createLinter();
    const html = `
      <html>
        <head></head>
        <head></head>
        <head></head>
      </html>
    `;
    
    linter.lint(html, none, { "html-valid-content-model": true }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    }); 
  });

  it("Should accept only one <body> as child", function(done) {
    const linter = createLinter();
    const html = `
      <html>
        <body></body>
        <body></body>
        <body></body>
      </html>
    `;
    
    linter.lint(html, none, { "html-valid-content-model": true }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    }); 
  });
});
