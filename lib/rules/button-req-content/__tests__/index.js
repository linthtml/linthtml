const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("button-req-content", function() {
  it("Should report an error when button has no text", async function() {
    const linter = createLinter();
    const html = "<button></button>";

    const issues = await linter.lint(html, none, { "button-req-content": true });
    expect(issues).to.have.lengthOf(1);
  });
  it("Should report an error when button has only whitespaces has content", async function() {
    const linter = createLinter();
    const html = "<button>       </button>";

    const issues = await linter.lint(html, none, { "button-req-content": true });
    expect(issues).to.have.lengthOf(1);
  });
  it("Should report an error when button has no text (deep nesting)", async function() {
    const linter = createLinter();
    const html = "<button><span><span><span></span><strong></strong></span></span></button>";

    const issues = await linter.lint(html, none, { "button-req-content": true });
    expect(issues).to.have.lengthOf(1);
  });
  it("Should not report an error when button has text", async function() {
    const linter = createLinter();
    const html = "<button>foo</button>";

    const issues = await linter.lint(html, none, { "button-req-content": true });
    expect(issues).to.have.lengthOf(0);
  });
  it("Should not report an error when button has text and an html comment", async function() {
    const linter = createLinter();
    const html = "<button><!-- comment -->foo</button>";

    const issues = await linter.lint(html, none, { "button-req-content": true });
    expect(issues).to.have.lengthOf(0);
  });
  it("Should not report an error when button has text content (deep nesting)", async function() {
    const linter = createLinter();
    const html = "<button><span><span><span>foo</span></span></span></button>";

    const issues = await linter.lint(html, none, { "button-req-content": true });
    expect(issues).to.have.lengthOf(0);
  });
  it("Should not report an error when button has text content (multiple text deep nesting)", async function() {
    const linter = createLinter();
    const html = "<button><span><span><span>foo</span><strong>bar</strong></span></span></button>";

    const issues = await linter.lint(html, none, { "button-req-content": true });
    expect(issues).to.have.lengthOf(0);
  });
  it("Should report an error when button has an aria-label with no content", async function() {
    const linter = createLinter();
    const html = "<button aria-label=\"\"></button>";

    const issues = await linter.lint(html, none, { "button-req-content": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error when button has an aria-label with content", async function() {
    const linter = createLinter();
    const html = "<button aria-label=\"button\"></button>";

    const issues = await linter.lint(html, none, { "button-req-content": true });
    expect(issues).to.have.lengthOf(0);
  });
});
