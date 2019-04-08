const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require('../../../presets').presets.none;

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("attr-no-unsafe-char", function() {

  it("Should not report error for safe char in attributes", function(done) {
    const linter = createLinter();
    const html = `<div class="\u0040"></div>`;
    
    linter.lint(html, none, { "attr-no-unsafe-char": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should report error for unsafe char in attributes", function(done) {
    const linter = createLinter();
    const html = `<div class="\u070f"></div>`;
    
    linter.lint(html, none, { "attr-no-unsafe-char": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });
});

// \u0000 not accepted
