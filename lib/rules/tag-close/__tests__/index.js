const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | tag-close", function() {
  function createLinter() {
    return new linthtml.LegacyLinter(linthtml.rules);
  }
  it("Should not report an error for matching open/close tags", async function() {
    const linter = createLinter();
    const html = "<body></body><Div></Div>";
    const issues = await linter.lint(html, none, { "tag-name-match": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for not matching open/close tags", async function() {
    const linter = createLinter();
    const html = "<body></div>";
    const issues = await linter.lint(html, none, { "tag-close": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error for not matching open/close tags (different case)", async function() {
    const linter = createLinter();
    const html = "<body></Body>";
    const issues = await linter.lint(html, none, { "tag-name-match": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error per none matching open/close tags", async function() {
    const linter = createLinter();
    const html = "<body><p></span></div>";
    const issues = await linter.lint(html, none, { "tag-close": true });
    expect(issues).to.have.lengthOf(2);
  });

  it("Should report an error for not closed self closed tags when \"tag-self-close\" is set to \"always\"", async function() {
    const linter = createLinter();
    const html = "<img>";
    const issues = await linter.lint(html, none, { "tag-self-close": "always" });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error for closed self closed tags when \"tag-self-close\" is set to \"always\"", async function() {
    const linter = createLinter();
    const html = "<img/>";
    const issues = await linter.lint(html, none, { "tag-self-close": "always" });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for closed self closed tags when \"tag-self-close\" is set to \"never\"", async function() {
    const linter = createLinter();
    const html = "<img>";
    const issues = await linter.lint(html, none, { "tag-self-close": "never" });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error for not closed self closed tags when \"tag-self-close\" is set to \"never\"", async function() {
    const linter = createLinter();
    const html = "<img/>";
    const issues = await linter.lint(html, none, { "tag-self-close": "never" });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error for self closing tags", async function() {
    const linter = createLinter();
    const html = "<br/><br>";
    const issues = await linter.lint(html, none, { "tag-close": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error for unicode chars", async function() {
    const linter = createLinter();
    const html = "<span>&#8599;</span>";
    const issues = await linter.lint(html, none, { "tag-close": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error for an invalid config", function() {
    const linter = createLinter();
    const html = "<button\"></button>";
    expect(() => linter.lint(html, none, { "tag-self-close": true }))
      .to
      .throw("Configuration for rule \"tag-self-close\" is invalid: Expected string got boolean");
  });

  it("Should throw an error if not given a list of strings as config", function() {
    const linter = createLinter();
    const html = "<button></button>";
    expect(() => linter.lint(html, none, { "tag-self-close": "foo" }))
      .to
      .throw("Configuration for rule \"tag-self-close\" is invalid: \"foo\" is not accepted. Accepted values are \"always\" and \"never\".");
  });
});

describe("tag-close", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report an error for matching open/close tags", async function() {
    const linter = createLinter({ "tag-name-match": true });
    const html = "<body></body><Div></Div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for not matching open/close tags", async function() {
    const linter = createLinter({ "tag-close": true });
    const html = "<body></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error for not matching open/close tags (different case)", async function() {
    const linter = createLinter({ "tag-name-match": true });
    const html = "<body></Body>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error per none matching open/close tags", async function() {
    const linter = createLinter({ "tag-close": true });
    const html = "<body><p></span></div>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
  });

  it("Should report an error for not closed self closed tags when \"tag-self-close\" is set to \"always\"", async function() {
    const linter = createLinter({
      "tag-self-close": [
        true,
        "always"
      ]
    });
    const html = "<img>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error for closed self closed tags when \"tag-self-close\" is set to \"always\"", async function() {
    const linter = createLinter({
      "tag-self-close": [
        true,
        "always"
      ]
    });
    const html = "<img/>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error for closed self closed tags when \"tag-self-close\" is set to \"never\"", async function() {
    const linter = createLinter({
      "tag-self-close": [
        true,
        "never"
      ]
    });
    const html = "<img>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error for not closed self closed tags when \"tag-self-close\" is set to \"never\"", async function() {
    const linter = createLinter({
      "tag-self-close": [
        true,
        "never"
      ]
    });
    const html = "<img/>";
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
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

  it("Should throw an error for an invalid config", function() {
    const config = {
      "tag-self-close": [
        true,
        true
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"tag-self-close\" is invalid: Expected string got boolean");
  });

  it("Should throw an error if not given a list of strings as config", function() {
    const config = {
      "tag-self-close": [
        true,
        "foo"
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"tag-self-close\" is invalid: \"foo\" is not accepted. Accepted values are \"always\" and \"never\".");
  });
});
