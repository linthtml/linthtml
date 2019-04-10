const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require('../../../presets').presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("attr-validate", function() {

  it("Should report an error when given malformed attributes", function(done) {
    const linter = createLinter();
    const html = `<div class="large id="title"></div>`;
    
    linter.lint(html, none, { "attr-validate": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should report only one error per malformed attributes", function(done) {
    const linter = createLinter();
    const html = `<div class=large"><p class=="bold">text</p></div>`;
    
    linter.lint(html, none, { "attr-validate": true }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    }); 
  });


  it("Should not report an error for self-closing tags with no space before", function(done) {
    const linter = createLinter();
    const html = `<meta charset="utf-8"/>`;
    
    linter.lint(html, none, { "attr-validate": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });
});

// module.exports = [
//   {
//     /// NOt sure about the test + attributes should not allow \n \r
//     desc: "should pass valid attribute list 2",
//     input: "<div\t  claSs =\"large\" id=a\nid\r='\n\tb  ' ></div>",
//     opts: { "attr-validate": true },
//     output: 0
//   },
// ];
