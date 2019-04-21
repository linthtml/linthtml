const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("focusable-tabindex-style", function() {

  it("Should not report any error for tag with positive tabindex", function(done) {
    const linter = createLinter();
    const html = `
      <input type="text" name="foo" tabindex="5">
      <label for="foo">Foo input</label>
    `;
    
    linter.lint(html, none, { "focusable-tabindex-style": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should not report any error for tag without tabindex attribute", function(done) {
    const linter = createLinter();
    const html = `
      <input type="text" name="foo">
      <label for="foo">Foo input</label>
    `;
    
    linter.lint(html, none, { "focusable-tabindex-style": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report an error for tag with negative tabindex", function(done) {
    const linter = createLinter();
    const html = `
      <input type="text" name="bar" tabindex="-5">
      <label for="bar">Bar input</label>
    `;
    
    linter.lint(html, none, { "focusable-tabindex-style": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should report an error per tag with negative tabindex", function(done) {
    const linter = createLinter();
    const html = `
      <input type="text" name="bar" tabindex="-5">
      <label for="bar">Bar input</label>
      <input type="text" name="foo" tabindex="5">
      <label for="foo">Foo input</label>
      <input type="text" name="baz" tabindex="-5">
      <label for="baz">Baz input</label>
    `;
    
    linter.lint(html, none, { "focusable-tabindex-style": true }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    }); 
  });

  it("Should ignore disabled tag", function(done) {
    const linter = createLinter();
    const html = `
      <input type="text" name="bar" tabindex="-5" disabled>
      <label for="bar">Bar input</label>
    `;
    
    linter.lint(html, none, { "focusable-tabindex-style": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });
});
