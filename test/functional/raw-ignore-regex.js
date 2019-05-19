const linthtml = require("../../lib");
const none = require('../../lib/presets').presets.none;
const { expect } = require("chai");

function createLinter() {
  return new linthtml.Linter(linthtml.rules);
}
describe("raw-ignore-regex", function() {

  
  it("should remove matching text", async function() {
    const linter = createLinter();
    const html = `\r\r\r\r[[\r\n\t fjq\r\n\r]]\r\r\n`;

    const issues = await linter.lint(html, none, { "raw-ignore-regex": /\r/ });
    expect(issues).to.have.lengthOf(0);
  });

  it("should work across line breaks", async function() {
    const linter = createLinter();
    const html = `\r\r\r\r[[\r\n\t fjq\r\n\r]]\r\r`;

    const issues = await linter.lint(html, none, { "raw-ignore-regex": /\[\[[^]*?\]\]/ });
    expect(issues).to.have.lengthOf(0);
  });
  
  it("should work across line breaks", async function() {
    const linter = createLinter();
    const html = `\r{\r\r}\r[[\r\n\t fjq\r\n\r]]\r\r`;

    const issues = await linter.lint(html, none, { "raw-ignore-regex": /(\{[^]*?\}|\[\[[^]*?\]\])/  });
    expect(issues).to.have.lengthOf(0);
  });
});
