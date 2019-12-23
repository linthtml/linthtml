const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("input-req-label", function() {
  it("Should not report any error for label only", async function() {
    const linter = createLinter();
    const html = "<label>Label</label>";

    const issues = await linter.lint(html, none, { "input-req-label": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error if the text input has no attached label (parent node)", async function() {
    const linter = createLinter();
    const html = "<input type=\"text\">";

    const issues = await linter.lint(html, none, { "input-req-label": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error if the text input has an attached label (parent node)", async function() {
    const linter = createLinter();
    const html = "<label><span>Foo</span><input type=\"text\"></label>";

    const issues = await linter.lint(html, none, { "input-req-label": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error if the input has a id without a matching label node", async function() {
    const linter = createLinter();
    const html = "<label for=\"foo\">Foo</label><input type=\"text\" id=\"bar\">";

    const issues = await linter.lint(html, none, { "input-req-label": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error if the input has a id with a matching label node", async function() {
    const linter = createLinter();
    const html = "<label for=\"foo\">Foo</label><input type=\"text\" id=\"foo\">";

    const issues = await linter.lint(html, none, { "input-req-label": true });
    expect(issues).to.have.lengthOf(0);
  });
});

// module.exports = [
// TODO: Should report an error
//   {
//     desc: 'should do nothing with a label with a "for" attrib',
//     input: '<label for="doesntmatter">Just a label</label>',
//     opts: { "input-req-label": true },
//     output: 0
//   },
// TODO: Should report an error ?
//   {
//     desc: "should do nothing with just an input",
//     input: "<input >",
//     opts: { "input-req-label": true },
//     output: 0
//   },
// TODO: Should report an error
//   {
//     desc: "should do nothing with an input of the wrong type",
//     input: '<input type="number" >',
//     opts: { "input-req-label": true },
//     output: 0
//   },
// ];
