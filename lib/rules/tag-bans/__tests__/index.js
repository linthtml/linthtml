const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("tag-bans", function() {
  it("Should report an error for a tag named 'style'", async function() {
    const linter = createLinter();
    const html = "<body><style>hello</style></body>";
    const issues = await linter.lint(html, none, { "tag-bans": ["style"] });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should accept a single string as option", async function() {
    const linter = createLinter();
    const html = "<style></style>";
    const issues = await linter.lint(html, none, { "tag-bans": "style" });
    expect(issues).to.have.lengthOf(1);
  });

  it("Banned tags should be case insensitive", async function() {
    const linter = createLinter();
    const html = "<div></div>";
    const issues = await linter.lint(html, none, { "tag-bans": ["DiV"] });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should throw an error for an invalid config", function() {
    const linter = createLinter();
    const html = "<button style=\"color: red;\"></button>";
    expect(() => linter.lint(html, none, { "tag-bans": true }))
      .to
      .throw("Configuration for rule \"tag-bans\" is invalid: Expected string or string[] got boolean");
  });

  it("Should throw an error if not given a list of strings as config", function() {
    const linter = createLinter();
    const html = "<button style=\"color: red;\"></button>";
    expect(() => linter.lint(html, none, { "tag-bans": ["string", true] }))
      .to
      .throw("Configuration for rule \"tag-bans\" is invalid: Expected string or string[] got boolean[]");
  });
});
