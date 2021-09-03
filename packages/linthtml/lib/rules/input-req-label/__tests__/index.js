const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | input-req-label", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report any error for label only", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<label>Label</label>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error if the text input has no attached label (parent node)", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<input type=\"text\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error if the text input has an attached label (parent node)", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<label><span>Foo</span><input type=\"text\"></label>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error if the input has a id without a matching label node", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<label for=\"foo\">Foo</label><input type=\"text\" id=\"bar\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error if the input has a id with a matching label node", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<label for=\"foo\">Foo</label><input type=\"text\" id=\"foo\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for hidden input without label", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<input type=\"hidden\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for button input with a value", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<input type=\"button\" value=\"Click me\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for button input without a value", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<input type=\"button\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error for button input without an empty value", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<input type=\"button\" value=\"\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
});
describe("input-req-label", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report any error for label only", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<label>Label</label>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error if the text input has no attached label (parent node)", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<input type=\"text\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error if the text input has an attached label (parent node)", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<label><span>Foo</span><input type=\"text\"></label>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error if the input has a id without a matching label node", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<label for=\"foo\">Foo</label><input type=\"text\" id=\"bar\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report any error if the input has a id with a matching label node", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<label for=\"foo\">Foo</label><input type=\"text\" id=\"foo\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for hidden input without label", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<input type=\"hidden\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error for button input with a value", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<input type=\"button\" value=\"Click me\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for button input without a value", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<input type=\"button\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error for button input without an empty value", async function() {
    const linter = createLinter({ "input-req-label": true });
    const html = "<input type=\"button\" value=\"\">";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
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
