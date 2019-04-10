const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require('../../../presets').presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("attr-req-value", function() {

  it("Should not report an error for attribute with a value", function(done) {
    const linter = createLinter();
    const html = `<div class="foo"></div>`;
    
    linter.lint(html, none, { "attr-req-value": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should accept spaces in atributes value", function(done) {
    const linter = createLinter();
    const html = `<div class="foo bar"></div>`;
    
    linter.lint(html, none, { "attr-req-value": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report an error when an attribut didn't have a value", function(done) {
    const linter = createLinter();
    const html = `<div class></div>`;
    
    linter.lint(html, none, { "attr-req-value": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should report an error when an attribut didn't have a value (with an equal sign)", function(done) {
    const linter = createLinter();
    const html = `<div class= id="bar"></div>`;
    
    linter.lint(html, none, { "attr-req-value": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Should not report an error for empty value", function(done) {
    const linter = createLinter();
    const html = `<div id=""></div>`;
    
    linter.lint(html, none, { "attr-req-value": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should not report errors for bolean attributes", function(done) {
    const linter = createLinter();
    const html = `
      <input type="text" id="input" name="input" required disabled>
      <label for="input">Text input</label>
    `;
    
    linter.lint(html, none, { "attr-req-value": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should report errors for bolean attributes with '=' but no values", function(done) {
    const linter = createLinter();
    const html = `
      <input type="text" id="input" name="input" required= disabled>
      <label for="input">Text input</label>
    `;
    
    linter.lint(html, none, { "attr-req-value": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });
});

// module.exports = [
  // //test htmlparser ?
//     desc: "should handle non-lowercase attribute names",
//     input: '<img SRC="test image.jpg" Alt="test">',
//     opts: { "attr-req-value": true },
//     output: 0
//   },
