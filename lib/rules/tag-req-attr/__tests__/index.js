const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("tag-req-attr", function() {

  it("Should not report any error when config is an empty object", function(done) {
    const linter = createLinter();
    const html = `<img />`;
    
    linter.lint(html, none, { "tag-req-attr": {}  }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should not report any error when tag contain mandatory attributes", function(done) {
    const linter = createLinter();
    const html = `<img src="nyan.mrw" alt="nyan" />`;
    
    linter.lint(html, none, { "tag-req-attr": { img: [{ name: "src" }, { name: "alt" }] } }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should an report an error per missing attributes", function(done) {
    const linter = createLinter();
    const html = `<img/>`;
    
    linter.lint(html, none, { "tag-req-attr": { img: [{ name: "src" }, { name: "alt" }] } }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    }); 
  });

  it("Mandatory attributes should not be empty by default", function(done) {
    const linter = createLinter();
    const html = `<input required />`;
    
    linter.lint(html, none, { "tag-req-attr": { input: [{ name: "required" } ] } }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it(`Should not report an error for empty attribute when "allowEmpty" is specified`, function(done) {
    const linter = createLinter();
    const html = `<input required />`;
    
    linter.lint(html, none, { "tag-req-attr": { input: [{ name: "required", allowEmpty: true } ] } }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it(`Should not report any error when there's no configuration for the tag`, function(done) {
    const linter = createLinter();
    const html = `<img />`;
    
    linter.lint(html, none, { "tag-req-attr": { input: [{ name: "required", allowEmpty: true } ] } }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });
    
  it("Should throw an error for an invalid config", function() {
    const linter = createLinter();
    const html = ``;
    expect(() => linter.lint(html, none, { "tag-req-attr": "foo" }))
      .to
      .throw(`Configuration for rule "tag-req-attr" is invalid: Expected object got string`);
  });

});

// module.exports = [
//   {
//     desc: "should pass when there is no configuration for the tag",
//     input: '<img src="nyan.mrw" alt="" />',
//     opts: {
//       "tag-req-attr": {
//         input: [
//           {
//             name: "type"
//           }
//         ]
//       }
//     },
//     output: 0
//   }
// ];
