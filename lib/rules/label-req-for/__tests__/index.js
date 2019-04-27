const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("label-req-for", function() {

  it("Should not report any error when label has for value matching an existing input id", function(done) {
    const linter = createLinter();
    const html = `
      <label for="foo">Foo</label>
      <input type="radio" id="foo">
    `;
    
    linter.lint(html, none, { "label-req-for": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report an error when label has for value not matching an existing input id", function(done) {
    const linter = createLinter();
    const html = `
      <label for="foo">Foo</label>
      <input type="radio" id="bar">
    `;
    
    linter.lint(html, none, { "label-req-for": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should be able to deal with multiple label/input", function(done) {
    const linter = createLinter();
    const html = `
      <label for="foo">Foo</label>
      <input type="text" id="foo"/>
      <label for="bar">Bar</label>
      <input type="text" id="bar"/>
    `;
    
    linter.lint(html, none, { "label-req-for": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should not report any error event when label+input are not siblings", function(done) {
    const linter = createLinter();
    const html = `
    <input type="text" id="bar"/>
      <label for="foo">Foo</label>
      <label for="bar">Bar</label>
      <input type="text" id="foo"/>
    `;
    
    linter.lint(html, none, { "label-req-for": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should not report any error when label without for has a input has child node", function(done) {
    const linter = createLinter();
    const html = `
      <label for="foo">
        Foo
        <div>
          <input type="text" id="foo"/>
        </div>
      </label>
    `;
    
    linter.lint(html, none, { "label-req-for": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    }); 
  });

  it("Should report an error when label without for doesnt't have any labelable node has child", function(done) {
    const linter = createLinter();
    const html = `
      <label for="foo">
        Foo
        <div>
          Bar
        </div>
      </label>
    `;
    
    linter.lint(html, none, { "label-req-for": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });

  it("Should report an error when label has for value matching an none labelable node", function(done) {
    const linter = createLinter();
    const html = `
      <label for="foo">Foo</label>
      <p id="foo">Text content</p>
    `;
    
    linter.lint(html, none, { "label-req-for": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    }); 
  });
});
