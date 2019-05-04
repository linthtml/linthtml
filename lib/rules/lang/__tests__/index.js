const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("html-req-lang", function() {

  it("Should not report any error when html tag as a none empty lang attribute", function(done) {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      </html>
    `;
    
    linter.lint(html, none, { "html-req-lang": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report an error when html tag does not have a lang attribute", function(done) {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
      <html>
      </html>
    `;
    
    linter.lint(html, none, { "html-req-lang": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });
});
describe("html-req-lang", function() {

  it("Should report an error for invalid lang code", function(done) {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
      <html lang="foo">
      </html>
    `;
    
    linter.lint(html, none, { "lang-style": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should not report any error for valid lang code", function(done) {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;
    
    linter.lint(html, none, { "lang-style": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  // TODO: Should not
  it("Should allow empty lang tag", function(done) {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
      <html lang="">
      </html>
    `;

    linter.lint(html, none, { "lang-style": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it(`Should report an error on wrong-case lang`, function(done) {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
      <html lang="en-us">
      </html>
    `;

    linter.lint(html, none, { "lang-style": "case" }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });
  
  it(`Should not report any for correct case lang`, function(done) {
    const linter = createLinter();
    const html = `
      <!DOCTYPE html>
      <html lang="en-US">
      </html>
    `;

    linter.lint(html, none, { "lang-style": "case" }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const linter = createLinter();
    const html = ``;

    expect(() => linter.lint(html, none, { "lang-style": 0 }))
      .to
      .throw(`Configuration for rule "lang-style" is invalid: Expected boolean got number`);
  });

  it("Should throw an error for invalid config (not valid string)", function() {
    const linter = createLinter();
    const html = ``;

    expect(() => linter.lint(html, none, { "lang-style": "foo" }))
      .to
      .throw(`Configuration for rule "lang-style" is invalid: Only "case" is accepted as string value`);
  });
});
