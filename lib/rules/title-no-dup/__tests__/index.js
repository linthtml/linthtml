const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;
function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}

describe("title-no-dup", function() {

  it("Should not report an error when title is not duplicated", function(done) {
    const linter = createLinter();
    const html = `<head><title>Title!</title></head>`;
    
    linter.lint(html, none, { "title-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("Should report an error when title is duplicated", function(done) {
    const linter = createLinter();
    const html = `<head><title>Title!</title><title>Title!</title></head>`;
    
    linter.lint(html, none, { "title-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(1);
      done();
    });
  });

  it("Should catch multiple duplicates", function(done) {
    const linter = createLinter();
    const html = `<head><title>Title!</title><title>Title!</title><title>Title!</title><title>Title!</title></head>`;
    
    linter.lint(html, none, { "title-no-dup": true }).then((issues) => {
      expect(issues).to.have.lengthOf(3);
      done();
    });
  });

});
