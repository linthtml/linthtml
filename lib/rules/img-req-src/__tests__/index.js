const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("img-req-src", function() {
  it("Should not report any error for <img> with an src value", async function() {
    const linter = createLinter();
    const html = "<img src=\"cat.jpg\" alt=\"A cat picture\">";

    const issues = await linter.lint(html, none, { "img-req-src": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for <img> without src alt value", async function() {
    const linter = createLinter();
    const html = "<img>";

    const issues = await linter.lint(html, none, { "img-req-src": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error for <img> with an empty src value", async function() {
    const linter = createLinter();
    const html = "<img src=\"\">";

    const issues = await linter.lint(html, none, { "img-req-src": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should check only <img> ", async function() {
    const linter = createLinter();
    const html = "<div src=\"\">";

    const issues = await linter.lint(html, none, { "img-req-src": true });
    expect(issues).to.have.lengthOf(0);
  });
});
