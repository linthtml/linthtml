const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("doctype-first", function() {

  it("Should not report any error when DOCTYPE is first", function(done) {
    const linter = createLinter();
    const html = `
      <!DOCTYPE>
      <html></html>
    `;
    
    linter.lint(html, none, { "doctype-first": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should be case-insensitive", function(done) {
    const linter = createLinter();
    const html = `
      <!doctype>
      <html></html>
    `;
    
    linter.lint(html, none, { "doctype-first": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report an error when doctype is not present", function(done) {
    const linter = createLinter();
    const html = `
      <html></html>
    `;
    
    linter.lint(html, none, { "doctype-first": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should report an error when DOCTYPE is not first", function(done) {
    const linter = createLinter();
    const html = `
      <html></html>
      <!DOCTYPE>
    `;
    
    linter.lint(html, none, { "doctype-first": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should not report any error when there's mutiple DOCTYPE (if one is first)", function(done) {
    const linter = createLinter();
    const html = `
      <!DOCTYPE>
      <!DOCTYPE>
      <html></html>
      <!DOCTYPE>
    `;
    
    linter.lint(html, none, { "doctype-first": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  // should report an error
  it("Should not report any error if the firt element is not an html tag", function(done) {
    const linter = createLinter();
    const html = `
      foobar
    `;
    
    linter.lint(html, none, { "doctype-first": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  // should report an error
  it("Should not report any error if the firt element is a comment", function(done) {
    const linter = createLinter();
    const html = `
      <!-- A comment -->
      <!DOCTYPE>
      <html></html>
    `;
    
    linter.lint(html, none, { "doctype-first": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });


  describe("`smart` mode", function() {

    it("Should not report any error when there's no doctype and <head>", function(done) {
      const linter = createLinter();
      const html = `
        <section></section>
      `;
      
      linter.lint(html, none, { "doctype-first": "smart" }).then((issues) => {
        expect(issues).to.have.lengthOf(0);
        done();
      }); 
    });

    it("Should report an error when there's no doctype but an <head>", function(done) {
      const linter = createLinter();
      const html = `
        <head></head>
        <section></section>
      `;
      
      linter.lint(html, none, { "doctype-first": "smart" }).then((issues) => {
        expect(issues).to.have.lengthOf(1);
        done();
      }); 
    });

  });

  it("Should throw an error for invalid config (wrong type)", function() {
    const linter = createLinter();
    const html = `<div class="foo"></div>`;

    expect(() => linter.lint(html, none, { "doctype-first": 0 }))
      .to
      .throw(`Configuration for rule "doctype-first" is invalid: Expected boolean got number`);
  });

  it("Should throw an error for invalid config (not valid string)", function() {
    const linter = createLinter();
    const html = `<div class="bar"></div>`;

    expect(() => linter.lint(html, none, { "doctype-first": "foo" }))
      .to
      .throw(`Configuration for rule "doctype-first" is invalid: Only "smart" is accepted as string value`);
  });
});
