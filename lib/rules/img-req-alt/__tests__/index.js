const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("img-req-alt", function() {

  it("Should not report any error for <img> with an alt value", function(done) {
    const linter = createLinter();
    const html = `<img src="cat.jpg" alt="A cat picture">`;
    
    linter.lint(html, none, { "img-req-alt": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report an error for <img> without an alt value", function(done) {
    const linter = createLinter();
    const html = `<img src="cat.jpg">`;
    
    linter.lint(html, none, { "img-req-alt": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should report an error for <img> with an empty alt value", function(done) {
    const linter = createLinter();
    const html = `<img src="cat.jpg" alt="">`;
    
    linter.lint(html, none, { "img-req-alt": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should check only <img> ", function(done) {
    const linter = createLinter();
    const html = `<div alt="">`;
    
    linter.lint(html, none, { "img-req-alt": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  describe(`"allownull" option`, function() {

    it("Should not report error for <img> with an empty alt value", function(done) {
      const linter = createLinter();
      const html = `<img src="cat.jpg" alt="">`;
      
      linter.lint(html, none, { "img-req-alt": "allownull" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });

    it("Should report an error for <img> without an alt value", function(done) {
      const linter = createLinter();
      const html = `<img src="cat.jpg">`;
      
      linter.lint(html, none, { "img-req-alt": "allownull" }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      }); 
    });
  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const linter = createLinter();
    const html = `<img src="cat.jpg">`;

    expect(() => linter.lint(html, none, { "img-req-alt": 0 }))
      .to
      .throw(`Configuration for rule "img-req-alt" is invalid: Expected boolean got number`);
  });

  it("Should throw an error for invalid config (not valid string)", function() {
    const linter = createLinter();
    const html = `<img src="cat.jpg">`;

    expect(() => linter.lint(html, none, { "img-req-alt": "foo" }))
      .to
      .throw(`Configuration for rule "img-req-alt" is invalid: Only "allownull" is accepted as string value`);
  });
});
