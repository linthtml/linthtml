const linthtml = require("../../lib");
const none = require('../../lib/presets').presets.none;
const { expect } = require("chai");

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("raw-ignore-regex", function() {

  
  it("should remove matching text", function(done) {
    const linter = createLinter();
    const html = `\r\r\r\r[[\r\n\t fjq\r\n\r]]\r\r\n`;

    linter.lint(html, none, { "raw-ignore-regex": /\r/ }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });

  it("should work across line breaks", function(done) {
    const linter = createLinter();
    const html = `\r\r\r\r[[\r\n\t fjq\r\n\r]]\r\r`;

    linter.lint(html, none, { "raw-ignore-regex": /\[\[[^]*?\]\]/ }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });
  
  it("should work across line breaks", function(done) {
    const linter = createLinter();
    const html = `\r{\r\r}\r[[\r\n\t fjq\r\n\r]]\r\r`;

    linter.lint(html, none, { "raw-ignore-regex": /(\{[^]*?\}|\[\[[^]*?\]\])/  }).then((issues) => {
      expect(issues).to.have.lengthOf(0);
      done();
    });
  });
});
