const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("input-req-label", function() {

  it("Should not report any error for label only", function(done) {
    const linter = createLinter();
    const html = `<label>Label</label>`;
    
    linter.lint(html, none, { "input-req-label": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });
  
  it("Should report an error if the text input has no attached label (parent node)", function(done) {
    const linter = createLinter();
    const html = `<input type="text">`;
    
    linter.lint(html, none, { "input-req-label": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should not report any error if the text input has an attached label (parent node)", function(done) {
    const linter = createLinter();
    const html = `<label><span>Foo</span><input type="text"></label>`;
    
    linter.lint(html, none, { "input-req-label": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report an error if the input has a id without a matching label node", function(done) {
    const linter = createLinter();
    const html = `<label for="foo">Foo</label><input type="text" id="bar">`;
    
    linter.lint(html, none, { "input-req-label": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should not report any error if the input has a id with a matching label node", function(done) {
    const linter = createLinter();
    const html = `<label for="foo">Foo</label><input type="text" id="foo">`;
    
    linter.lint(html, none, { "input-req-label": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });
});

// module.exports = [
// TODO: Should report an error
//   {
//     desc: 'should do nothing with a label with a "for" attrib',
//     input: '<label for="doesntmatter">Just a label</label>',
//     opts: { "input-req-label": true },
//     output: 0
//   },
// TODO: Should report an error ?
//   {
//     desc: "should do nothing with just an input",
//     input: "<input >",
//     opts: { "input-req-label": true },
//     output: 0
//   },
// TODO: Should report an error
//   {
//     desc: "should do nothing with an input of the wrong type",
//     input: '<input type="number" >',
//     opts: { "input-req-label": true },
//     output: 0
//   },
// ];
