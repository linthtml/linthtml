const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("id-no-dup", function() {

  it("Should not report an error when there's no duplicated id", function(done) {
    const linter = createLinter();
    const html = `<div id="foo"></div>`;
    
    linter.lint(html, none, { "id-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report errors when there's duplicated id", function(done) {
    const linter = createLinter();
    const html = `
      <div id="foo"></div>
      <div id="foo"></div>
    `;
    
    linter.lint(html, none, { "id-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Should catch mutliple duplicates id", function(done) {
    const linter = createLinter();
    const html = `
      <div id="foo"></div>
      <div id="bar"></div>
      <div id="foo"></div>
      <div id="bar"></div>
    `;
    
    linter.lint(html, none, { "id-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    });
  });

  // TODO: should ignore trailling/leading space ?
  // it("Should catch duplicates id even with leading and trailing whitespaces", function(done) {
  //   const linter = createLinter();
  //   const html = `
  //     <div id="foo"></div>
  //     <div id="bar "></div>
  //     <div id=" foo"></div>
  //     <div id="bar"></div>
  //   `;
    
  //   linter.lint(html, none, { "id-no-dup": true }).then((issues) => {
  //     expect(issues).to.have.lengthOf(2);
  //     done();
  //   });
  // });
  
});
