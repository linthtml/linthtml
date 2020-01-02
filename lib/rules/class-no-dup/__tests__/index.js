const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("class-no-dup", function() {
  it("Should not report an error when there's no duplicated classes", async function() {
    const linter = createLinter();
    const html = "<div class=\"foo\"></div>";

    const issues = await linter.lint(html, none, { "class-no-dup": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors when there's duplicated classes", async function() {
    const linter = createLinter();
    const html = "<div class=\"foo foo\"></div>";

    const issues = await linter.lint(html, none, { "class-no-dup": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should catch mutliple duplicates class", async function() {
    const linter = createLinter();
    const html = "<div class=\"foo foo bar bar\"></div>";

    const issues = await linter.lint(html, none, { "class-no-dup": true });
    expect(issues).to.have.lengthOf(2);
  });

  it("Should catch duplicates class even with leading and trailing whitespaces", async function() {
    const linter = createLinter();
    const html = "<div class=\" foo foo \"></div>";

    const issues = await linter.lint(html, none, { "class-no-dup": true });
    expect(issues).to.have.lengthOf(1);
  });
});

describe("class-no-dup + id-class-ignore-regexp", function() {
  it("Should report errors for duplicates classes not matching a custom separator", async function() {
    const linter = createLinter();
    const html = "<div class=\"foo foo\"></div>";

    const issues = await linter.lint(html, none, { "class-no-dup": true, "id-class-ignore-regex": /^b/ });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should no report errors for duplicates classes matching a custom separator", async function() {
    const linter = createLinter();
    const html = "<div class=\"bar bar baz baz\"></div>";

    const issues = await linter.lint(html, none, { "class-no-dup": true, "id-class-ignore-regex": /^b/ });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not if `id-class-ignore-regex` contain a capturing group", async function() {
    const linter = createLinter();
    const html = "<div class=\"bar bar baz baz\"></div>";

    const issues = await linter.lint(html, none, { "class-no-dup": true, "id-class-ignore-regex": /^(b)/ });
    expect(issues).to.have.lengthOf(0);
  });
});
