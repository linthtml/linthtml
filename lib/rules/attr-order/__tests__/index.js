const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("attr-order", function() {
  it("Should not report errors when attributes are in the correct order", async function() {
    const linter = createLinter();
    const html = "<img class='test' src='test.gif' height='200' width='300'/>";

    const issues = await linter.lint(html, none, { "attr-order": ["class", "src", "height", "width"] });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should fail when attribute order is reversed", async function() {
    const linter = createLinter();
    const html = "<img src='test.gif' class='test' />";

    const issues = await linter.lint(html, none, { "attr-order": ["class", "src"] });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report one error per misplaced attribute", async function() {
    const linter = createLinter();
    const html = "<img height='200' src='test.gif' class='test' width='300'/>";

    const issues = await linter.lint(html, none, { "attr-order": ["class", "src", "height", "width"] });
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not report error for attributes that are not present", async function() {
    const linter = createLinter();
    const html = "<img src='test.gif' height='200'/>";

    const issues = await linter.lint(html, none, { "attr-order": ["class", "src", "height", "width"] });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report additional errors for attributes which are not present", async function() {
    const linter = createLinter();
    const html = "<img src='test.gif' class='test'/>";

    const issues = await linter.lint(html, none, { "attr-order": ["class", "src", "height", "width"] });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should be case insensitive (OK)", async function() {
    const linter = createLinter();
    const html = "<img CLASS='test' src='test.gif' height='200' width='300'/>";

    const issues = await linter.lint(html, none, { "attr-order": ["class", "src", "HEIGHT", "width"] });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should be case insensitive (KO)", async function() {
    const linter = createLinter();
    const html = "<img src='test.gif' CLASS='test' height='200' width='300'/>";

    const issues = await linter.lint(html, none, { "attr-order": ["class", "src", "HEIGHT", "width"] });
    expect(issues).to.have.lengthOf(1);
  });

  it("Shoud accept Regexp as config (OK)", async function() {
    const linter = createLinter();
    const html = "<img class='test' src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html, none, { "attr-order": ["class", /^.*$/] });
    expect(issues).to.have.lengthOf(0);
  });

  it("Shoud accept Regexp as config (KO)", async function() {
    const linter = createLinter();
    const html = "<img src='test.gif' class='test' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html, none, { "attr-order": ["class", /^.*$/] });
    expect(issues).to.have.lengthOf(1);
  });

  it("Shoud accept multiple Regexp as config (OK)", async function() {
    const linter = createLinter();
    const html = "<img class='test' data-x src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html, none, { "attr-order": ["class", /^data-.*$/, /^.*$/] });
    expect(issues).to.have.lengthOf(0);
  });

  it("Shoud accept multiple Regexp as config (KO)", async function() {
    const linter = createLinter();
    const html = "<img data-x class='test' src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html, none, { "attr-order": ["class", /^data-.*$/, /^.*$/] });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should throw an error when an invalid config is provided", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "attr-order": ["class", 3] }))
      .to
      .throw("Configuration for rule \"attr-order\" is invalid: Expected (string|RegExp)[] got number[]");
  });

  it("Should throw an error when an invalid config is provided (string only)", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "attr-order": "class" }))
      .to
      .throw("Configuration for rule \"attr-order\" is invalid: Expected (string|RegExp)[] got string");
  });
});
