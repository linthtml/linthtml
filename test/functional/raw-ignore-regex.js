const linthtml = require("../../lib");
const none = require('../../lib/presets').presets.none;
const base = require('../../lib/presets').presets.default;
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
  
  it("should not cause any error with text", async function() {
    const linter = createLinter();
    const html = [
      "<p>",
      "\t{{ .aVariable }}",
      "</p>"
    ].join("\n");

    const issues = await linter.lint(html, base, { "raw-ignore-regex": /{{.*}}/, "line-end-style": false  });
    expect(issues).to.have.lengthOf(0);
  });
  
  it("should not cause any error inside attributes work across line break", async function() {
    const linter = createLinter();
    const html = `<p class="a {{ if $bar "bar" . }} c {{else}} b{{ /if }}">foo</p>`;
    const issues = await linter.lint(html, base, { "raw-ignore-regex": /{{.*}}/, "line-end-style": false  });
    expect(issues).to.have.lengthOf(0);
  });
  
  it("should not cause any error inside on multiline", async function() {
    const linter = createLinter();
    const html = [
      "<p>",
      "\t{{ ",
      "\t .aVariable",
      "\t }}",
      "</p>"
    ].join("\n");
    const issues = await linter.lint(html, base, { "raw-ignore-regex": /{{(.*[\n\r].*)+}}/, "line-end-style": false  });
    expect(issues).to.have.lengthOf(0);
  });
});
