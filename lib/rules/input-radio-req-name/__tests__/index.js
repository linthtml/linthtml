const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("input-radio-req-name", function() {

  it("Should not report any error for radio input with a name", function(done) {
    const linter = createLinter();
    const html = `<input type="radio" name="foo">`;
    
    linter.lint(html, none, { "input-radio-req-name": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report an error for radio input without a name", function(done) {
    const linter = createLinter();
    const html = `<input type="radio">`;
    
    linter.lint(html, none, { "input-radio-req-name": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should report an error for radio input with an empty name value", function(done) {
    const linter = createLinter();
    const html = `<input type="radio" name="">`;
    
    linter.lint(html, none, { "input-radio-req-name": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should not report any error if input with no type", function(done) {
    const linter = createLinter();
    const html = `<input>`;
    
    linter.lint(html, none, { "input-radio-req-name": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should not report any error if input is not a radio input", function(done) {
    const linter = createLinter();
    const html = `<input type="text">`;
    
    linter.lint(html, none, { "input-radio-req-name": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should check only input radio ", function(done) {
    const linter = createLinter();
    const html = `<div name="">`;
    
    linter.lint(html, none, { "input-radio-req-name": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });
});
