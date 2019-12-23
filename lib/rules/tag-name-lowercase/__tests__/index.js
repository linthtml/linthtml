const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("tag-name-lowercase", function() {
  it("Should report an error when tags name are not lowercased", async function() {
    const linter = createLinter();
    const html = "<boDY></boDY>";

    const issues = await linter.lint(html, none, { "tag-name-lowercase": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error pers tags not lowercased", async function() {
    const linter = createLinter();
    const html = "<boDY><seCtion></section></boDY>";

    const issues = await linter.lint(html, none, { "tag-name-lowercase": true });
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not report an error when tags name are lowercased", async function() {
    const linter = createLinter();
    const html = "<body></body>";

    const issues = await linter.lint(html, none, { "tag-name-lowercase": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should ignore directive", async function() {
    const linter = createLinter();
    const html = "<!DOCTYPE html>";

    const issues = await linter.lint(html, none, { "tag-name-lowercase": true });
    expect(issues).to.have.lengthOf(0);
  });
});
