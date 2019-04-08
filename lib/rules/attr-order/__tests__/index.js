const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require('../../../presets').presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("attr-order", function() {

  it("Should not report errors when attributes are in the correct order", function(done) {
    const linter = createLinter();
    const html = "<img class='test' src='test.gif' height='200' width='300'/>";
    
    linter.lint(html, none, { "attr-order": ["class", "src", "height", "width"] }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should fail when attribute order is reversed", function(done) {
    const linter = createLinter();
    const html = "<img src='test.gif' class='test' />";
    
    linter.lint(html, none, { "attr-order": ["class", "src"] }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Should report one error per misplaced attribute", function(done) {
    const linter = createLinter();
    const html = "<img height='200' src='test.gif' class='test' width='300'/>";
    
    linter.lint(html, none, { "attr-order": ["class", "src", "height", "width"] }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    });
  });

  it("Should not report error for attributes that are not present", function(done) {
    const linter = createLinter();
    const html = "<img src='test.gif' height='200'/>";
    
    linter.lint(html, none, { "attr-order": ["class", "src", "height", "width"] }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should not report additional errors for attributes which are not present", function(done) {
    const linter = createLinter();
    const html = "<img src='test.gif' class='test'/>";
    
    linter.lint(html, none, { "attr-order": ["class", "src", "height", "width"] }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Should be case insensitive (OK)", function(done) {
    const linter = createLinter();
    const html = "<img CLASS='test' src='test.gif' height='200' width='300'/>";
    
    linter.lint(html, none, { "attr-order": ["class", "src", "HEIGHT", "width"] }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });
  
  it("Should be case insensitive (KO)", function(done) {
    const linter = createLinter();
    const html = "<img src='test.gif' CLASS='test' height='200' width='300'/>";
    
    linter.lint(html, none, { "attr-order": ["class", "src", "HEIGHT", "width"] }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Shoud accept Regexp as config (OK)", function(done) {
    const linter = createLinter();
    const html = "<img class='test' src='test.gif' height='200' width='300'/>";
    
    // class then everything else
    linter.lint(html, none, { "attr-order": ["class", /^.*$/] }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Shoud accept Regexp as config (KO)", function(done) {
    const linter = createLinter();
    const html = "<img src='test.gif' class='test' height='200' width='300'/>";
    
    // class then everything else
    linter.lint(html, none, { "attr-order": ["class", /^.*$/] }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Shoud accept multiple Regexp as config (OK)", function(done) {
    const linter = createLinter();
    const html = "<img class='test' data-x src='test.gif' height='200' width='300'/>";
    
    // class then everything else
    linter.lint(html, none, { "attr-order": ["class", /^data-.*$/, /^.*$/] }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Shoud accept multiple Regexp as config (KO)", function(done) {
    const linter = createLinter();
    const html = "<img data-x class='test' src='test.gif' height='200' width='300'/>";
    
    // class then everything else
    linter.lint(html, none, { "attr-order": ["class", /^data-.*$/, /^.*$/] }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });


  it("Should throw an error  an invalid config is provided", function() {
    const linter = createLinter();
    const html = ``;
    expect(() => linter.lint(html, none, { "attr-order": ["class", 3] }))
      .to
      .throw(`Configuration for rule "attr-order" is invalid: Expected (string|RegExp)[] got number[]`);
  });

  it("Should throw an error  an invalid config is provided (string only)", function() {
    const linter = createLinter();
    const html = ``;
    expect(() => linter.lint(html, none, { "attr-order": "class" }))
      .to
      .throw(`Configuration for rule "attr-order" is invalid: Expected (string|RegExp)[] got string`);
  });
});
