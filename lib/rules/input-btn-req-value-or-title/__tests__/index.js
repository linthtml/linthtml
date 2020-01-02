const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("input-btn-req-value-or-title", function() {
  it("should fail for an input[button] without value and title", async function() {
    const linter = createLinter();
    const html = "<input type=\"button\">";

    const issues = await linter.lint(html, none, { "input-btn-req-value-or-title": true });
    expect(issues).to.have.lengthOf(1);
  });
  it("should fail for an input[submit] without value and title", async function() {
    const linter = createLinter();
    const html = "<input type=\"submit\">";

    const issues = await linter.lint(html, none, { "input-btn-req-value-or-title": true });
    expect(issues).to.have.lengthOf(1);
  });
  it("should fail for an input[reset] without value and title", async function() {
    const linter = createLinter();
    const html = "<input type=\"reset\">";

    const issues = await linter.lint(html, none, { "input-btn-req-value-or-title": true });
    expect(issues).to.have.lengthOf(1);
  });
  it("should ignore inputs that are not buttons", async function() {
    const linter = createLinter();
    const html = "<input type=\"radio\">";

    const issues = await linter.lint(html, none, { "input-btn-req-value-or-title": true });
    expect(issues).to.have.lengthOf(0);
  });
  it("should pass when input have a title", async function() {
    const linter = createLinter();
    const html = "<input type=\"button\" title=\"button\">";

    const issues = await linter.lint(html, none, { "input-btn-req-value-or-title": true });
    expect(issues).to.have.lengthOf(0);
  });
  it("should pass when input have a value", async function() {
    const linter = createLinter();
    const html = "<input type=\"button\" value=\"button\">";

    const issues = await linter.lint(html, none, { "input-btn-req-value-or-title": true });
    expect(issues).to.have.lengthOf(0);
  });
  it("should pass when input have a none empty aria-label", async function() {
    const linter = createLinter();
    const html = "<input type=\"button\" aria-label=\"button\">";

    const issues = await linter.lint(html, none, { "input-btn-req-value-or-title": true });
    expect(issues).to.have.lengthOf(0);
  });
  it("should fail when input have an empty aria-label", async function() {
    const linter = createLinter();
    const html = "<input type=\"button\" aria-label=\"\">";

    const issues = await linter.lint(html, none, { "input-btn-req-value-or-title": true });
    expect(issues).to.have.lengthOf(1);
  });
});

// module.exports = [
// {
//  it('should pass when input have a title',
//   input: '<input type="button" title="blah">',
//   opts: {
//       'input-btn-req-value-or-title': true
//   },
//   output: 0
// },
// {
//   desc: 'should pass when there is a value',
//   input: '<input type="button" value="blah">',
//   opts: {
//       'input-btn-req-value-or-title': true
//   },
//   output: 0
// }

// ];
