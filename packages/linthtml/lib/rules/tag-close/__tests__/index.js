const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | tag-close", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }

  it("Should report an error for not matching open/close tags", async function() {
    const linter = createLinter({ "tag-close": true });
    const html = "<body></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error per none matching open/close tags", async function() {
    const linter = createLinter({ "tag-close": true });
    const html = "<body><p></span></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not report an error for self closing tags", async function() {
    const linter = createLinter({ "tag-close": true });
    const html = "<br/><br>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error for unicode chars", async function() {
    const linter = createLinter({ "tag-close": true });
    const html = "<span>&#8599;</span>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});

describe("tag-close", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }

  it("Should report an error for not matching open/close tags", async function() {
    const linter = createLinter({ "tag-close": true });
    const html = "<body></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error per none matching open/close tags", async function() {
    const linter = createLinter({ "tag-close": true });
    const html = "<body><p></span></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should not report an error for self closing tags", async function() {
    const linter = createLinter({ "tag-close": true });
    const html = "<br/><br>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error for unicode chars", async function() {
    const linter = createLinter({ "tag-close": true });
    const html = "<span>&#8599;</span>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
