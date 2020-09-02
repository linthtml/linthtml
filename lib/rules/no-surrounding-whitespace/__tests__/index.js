const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | no-surrounding-whitespace", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }

  it("Should report an error when there's whitespaces at the start of a text node", async function() {
    const linter = createLinter({ "no-surrounding-whitespace": true });
    const html = "<p>  foo</p>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].position)
      .to
      .deep
      .equal({
        start: {
          line: 1,
          column: 4
        },
        end: {
          line: 1,
          column: 6
        }
      });
  });

  it("Should report an error when there's whitespaces at the end of a text node", async function() {
    const linter = createLinter({ "no-surrounding-whitespace": true });
    const html = "<p>foo  </p>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].position)
      .to
      .deep
      .equal({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 9
        }
      });
  });

  it("Should not report an error when there's whitespaces before a sibling", async function() {
    const linter = createLinter({ "no-surrounding-whitespace": true });
    const html = "<p>foo <strong>bar</strong></p>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error when there's whitespaces after a sibling", async function() {
    const linter = createLinter({ "no-surrounding-whitespace": true });
    const html = "<p><strong>foo</strong>  bar</p>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("should not report an error for indentation text node", async function() {
    const linter = createLinter({ "no-surrounding-whitespace": true });
    const html = `
    <div>
      <p>foo</p>
      bar
    </div>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("should report an error", async function() {
    const linter = createLinter({ "no-surrounding-whitespace": true });
    const html = "<p> <strong>Lorem</strong> ipsum</p>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].position)
      .to
      .deep
      .equal({
        start: {
          line: 1,
          column: 4
        },
        end: {
          line: 1,
          column: 5
        }
      });
  });

  it("Should no report an error", async function() {
    const linter = createLinter({ "no-surrounding-whitespace": true });
    const html = [
      "<div>",
      "  <p>Lorem ipsum</p>",
      "</div>"
    ].join("\n");

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
describe("no-surrounding-whitespace", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }

  it("Should report an error when there's whitespaces at the start of a text node", async function() {
    const linter = createLinter({ "no-surrounding-whitespace": true });
    const html = "<p>  foo</p>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].position)
      .to
      .deep
      .equal({
        start: {
          line: 1,
          column: 4
        },
        end: {
          line: 1,
          column: 6
        }
      });
  });

  it("Should report an error when there's whitespaces at the end of a text node", async function() {
    const linter = createLinter({ "no-surrounding-whitespace": true });
    const html = "<p>foo  </p>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].position)
      .to
      .deep
      .equal({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 9
        }
      });
  });

  it("Should not report an error when there's whitespaces before a sibling", async function() {
    const linter = createLinter({ "no-surrounding-whitespace": true });
    const html = "<p>foo <strong>bar</strong></p>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error when there's whitespaces after a sibling", async function() {
    const linter = createLinter({ "no-surrounding-whitespace": true });
    const html = "<p><strong>foo</strong>  bar</p>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("should not report an error for indentation text node", async function() {
    const linter = createLinter({ "no-surrounding-whitespace": true });
    const html = `
    <div>
      <p>foo</p>
      bar
    </div>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("should report an error", async function() {
    const linter = createLinter({ "no-surrounding-whitespace": true });
    const html = "<p> <strong>Lorem</strong> ipsum</p>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].position)
      .to
      .deep
      .equal({
        start: {
          line: 1,
          column: 4
        },
        end: {
          line: 1,
          column: 5
        }
      });
  });

  it("Should no report an error", async function() {
    const linter = createLinter({ "no-surrounding-whitespace": true });
    const html = [
      "<div>",
      "  <p>Lorem ipsum</p>",
      "</div>"
    ].join("\n");

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});
