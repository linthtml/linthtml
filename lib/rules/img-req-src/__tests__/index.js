const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("img-req-src", function() {

  it("Should not report any error for <img> with an src value", function(done) {
    const linter = createLinter();
    const html = `<img src="cat.jpg" alt="A cat picture">`;
    
    linter.lint(html, none, { "img-req-src": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report an error for <img> without src alt value", function(done) {
    const linter = createLinter();
    const html = `<img>`;
    
    linter.lint(html, none, { "img-req-src": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should report an error for <img> with an empty src value", function(done) {
    const linter = createLinter();
    const html = `<img src="">`;
    
    linter.lint(html, none, { "img-req-src": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should check only <img> ", function(done) {
    const linter = createLinter();
    const html = `<div src="">`;
    
    linter.lint(html, none, { "img-req-src": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });
});
