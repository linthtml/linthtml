const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("attr-req-value", function() {
  it("Should not report an error for attribute with a value", async function() {
    const linter = createLinter();
    const html = "<div class=\"foo\"></div>";

    const issues = await linter.lint(html, none, { "attr-req-value": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should accept spaces in atributes value", async function() {
    const linter = createLinter();
    const html = "<div class=\"foo bar\"></div>";

    const issues = await linter.lint(html, none, { "attr-req-value": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when an attribut didn't have a value", async function() {
    const linter = createLinter();
    const html = "<div class></div>";

    const issues = await linter.lint(html, none, { "attr-req-value": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when an attribut didn't have a value (with an equal sign)", async function() {
    const linter = createLinter();
    const html = "<div class= id=\"bar\"></div>";

    const issues = await linter.lint(html, none, { "attr-req-value": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error for empty value", async function() {
    const linter = createLinter();
    const html = "<div id=\"\"></div>";

    const issues = await linter.lint(html, none, { "attr-req-value": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report errors for bolean attributes", async function() {
    const linter = createLinter();
    const html = `
      <input type="text" id="input" name="input" required disabled>
      <label for="input">Text input</label>
    `;

    const issues = await linter.lint(html, none, { "attr-req-value": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors for bolean attributes with '=' but no values", async function() {
    const linter = createLinter();
    const html = `
      <input type="text" id="input" name="input" required= disabled>
      <label for="input">Text input</label>
    `;

    const issues = await linter.lint(html, none, { "attr-req-value": true });
    expect(issues).to.have.lengthOf(1);
  });
});

// module.exports = [
// //test htmlparser ?
//     desc: "should handle non-lowercase attribute names",
//     input: '<img SRC="test image.jpg" Alt="test">',
//     opts: { "attr-req-value": true },
//     output: 0
//   },
