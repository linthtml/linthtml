const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require('../../../presets').presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("attr-new-line", function() {

  it("Should not report errors if the number of atributes is less or equal to the configuration", function(done) {
    const linter = createLinter();
    const html = `
      <div class="foo" id="bar"></div>
      <div class="foo"></div>
    `;
    linter.lint(html, none, { "attr-new-line": 2 }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should report errors if the number of attributes is superior to the rule's configuration", function(done) {
    const linter = createLinter();
    const html = `
      <div class="foo" id="bar"></div>
    `;
    linter.lint(html, none, { "attr-new-line": 1 }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Should not report errors when attributes are on new lines", function(done) {
    const linter = createLinter();
    const html = `
      <div class="foo"
            id="bar"
            attr></div>
    `;
    linter.lint(html, none, { "attr-new-line": 1 }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should accept less attributes per line than the value defined in the configuration", function(done) {
    const linter = createLinter();
    const html = `
      <div class="foo"
            id="bar"
            attr></div>
    `;
    linter.lint(html, none, { "attr-new-line": 2 }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should not report an error when there's one attribute on the first line and configuration is '+0'", function(done) {
    const linter = createLinter();
    const html = `<div class="foo"></div>`;
    linter.lint(html, none, { "attr-new-line": "+0" }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });
  it("Should report an error when there's more than one attribute on the first line and configuration is '+0'", function(done) {
    const linter = createLinter();
    const html = `<div class="foo" id="bar"></div>`;
    linter.lint(html, none, { "attr-new-line": "+0" }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Should report an error when there's attributes on line > 1 and configuration is '+0'", function(done) {
    const linter = createLinter();
    const html = `
      <div
        class="foo"
        id>
      </div>
    `;
    linter.lint(html, none, { "attr-new-line": "+0" }).then((issues) => {
      expect(issues).to.have.lengthOf(2);
      done();
    });
  });


  it("Should throw an error when an invalid config is provided", function() {
    const linter = createLinter();
    const html = `
      <div
        class="foo"
        id>
      </div>
    `;
    expect(() => linter.lint(html, none, { "attr-new-line": "toto" }))
      .to
      .throw(`Configuration for rule "attr-new-line" is invalid: Expected number or "+0" got string`);
  });
});
