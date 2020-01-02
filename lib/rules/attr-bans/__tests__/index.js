const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("attr-bans", function() {
  it("Should not report an error for a tag named 'style'", async function() {
    const linter = createLinter();
    const html = "<body><style>hello</style></body>";
    const issues = await linter.lint(html, none, { "attr-bans": ["style"] });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report anything when disabled", async function() {
    const linter = createLinter();
    const html = "<button style=\"color: red;\"></button>";
    const issues = await linter.lint(html, none, { "attr-bans": false });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should accept a single string as option", async function() {
    const linter = createLinter();
    const html = "<button style=\"color: red;\"></button>";
    const issues = await linter.lint(html, none, { "attr-bans": "style" });
    expect(issues).to.have.lengthOf(1);
  });

  it("Banned attributes should be case insensitive", async function() {
    const linter = createLinter();
    const html = "<body ban0 ban1>";
    const issues = await linter.lint(html, none, { "attr-bans": ["ban0", "bAN1"] });
    expect(issues).to.have.lengthOf(2);
  });

  it("Should accept regexes as config", async function() {
    const linter = createLinter();
    const html = "<div onClick='' onfocus='' noop=''></div>";
    const issues = await linter.lint(html, none, { "attr-bans": [/on\w+/i] });
    expect(issues).to.have.lengthOf(2);
  });

  it("Should throw an error for an invalid config", async function() {
    const linter = createLinter();
    const html = "<button style=\"color: red;\"></button>";
    expect(() => linter.lint(html, none, { "attr-bans": true }))
      .to
      .throw("Configuration for rule \"attr-bans\" is invalid: Expected string, RegExp or (string|RegExp)[] got boolean");
  });

  it("Should throw an error if not given a list of strings as config", function() {
    const linter = createLinter();
    const html = "<button style=\"color: red;\"></button>";
    expect(() => linter.lint(html, none, { "attr-bans": ["string", true] }))
      .to
      .throw("Configuration for rule \"attr-bans\" is invalid: Expected string, RegExp or (string|RegExp)[] got boolean[]");
  });

  it("Should report an error when the 'style' attribute is present", async function() {
    const linter = createLinter();
    const html = "<button style=\"color: red;\"></button>";
    const issues = await linter.lint(html, none, { "attr-bans": ["style"] });
    expect(issues).to.have.lengthOf(1);
  });
});
