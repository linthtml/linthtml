const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | tag-name-match", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report an error for matching open/close tags", async function() {
    const linter = createLinter({ "tag-name-match": true });
    const html = "<body></body><Div></Div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for not matching open/close tags (different case)", async function() {
    const linter = createLinter({ "tag-name-match": true });
    const html = "<body></Body>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
});

describe("tag-name-match", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report an error for matching open/close tags", async function() {
    const linter = createLinter({ "tag-name-match": true });
    const html = "<body></body><Div></Div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for not matching open/close tags (different case)", async function() {
    const linter = createLinter({ "tag-name-match": true });
    const html = "<body></Body>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });
});
