const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | line-no-trailing-whitespace", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should report an error when the line end with a trailing whitespace", async function() {
    const linter = createLinter({ "line-no-trailing-whitespace": true });
    const html = "1234 ";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].position).to.deep.equal({
      start: {
        line: 1,
        column: 5
      },
      end: {
        line: 1,
        column: 6
      }
    });
  });

  it("Should report an error per line with a trailing whitespace", async function() {
    const linter = createLinter({ "line-no-trailing-whitespace": true });
    const html = `
    foo 
    bar `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
    expect(issues[0].position).to.deep.equal({
      start: {
        line: 2,
        column: 8
      },
      end: {
        line: 2,
        column: 9
      }
    });
    expect(issues[1].position).to.deep.equal({
      start: {
        line: 3,
        column: 8
      },
      end: {
        line: 3,
        column: 9
      }
    });
  });

  it("Should not report an error when sibling is on the same line", async function() {
    const linter = createLinter({ "line-no-trailing-whitespace": true });
    const html = "foo   <strong>bar</strong> toto";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error when parent close tag is on the same line", async function() {
    const linter = createLinter({ "line-no-trailing-whitespace": true });
    const html = "<p>foo   </p>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report only on error when line end with multiples trailing whitespace", async function() {
    const linter = createLinter({ "line-no-trailing-whitespace": true });
    const html = "foo   ";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].position).to.deep.equal({
      start: {
        line: 1,
        column: 4
      },
      end: {
        line: 1,
        column: 7
      }
    });
  });
});
describe("line-no-trailing-whitespace", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should report an error when the line end with a trailing whitespace", async function() {
    const linter = createLinter({ "line-no-trailing-whitespace": true });
    const html = "1234 ";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].position).to.deep.equal({
      start: {
        line: 1,
        column: 5
      },
      end: {
        line: 1,
        column: 6
      }
    });
  });

  it("Should report an error per line with a trailing whitespace", async function() {
    const linter = createLinter({ "line-no-trailing-whitespace": true });
    const html = `
    foo 
    bar `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(2);
    expect(issues[0].position).to.deep.equal({
      start: {
        line: 2,
        column: 8
      },
      end: {
        line: 2,
        column: 9
      }
    });
    expect(issues[1].position).to.deep.equal({
      start: {
        line: 3,
        column: 8
      },
      end: {
        line: 3,
        column: 9
      }
    });
  });

  it("Should report only on error when line end with multiples trailing whitespace", async function() {
    const linter = createLinter({ "line-no-trailing-whitespace": true });
    const html = "foo   ";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].position).to.deep.equal({
      start: {
        line: 1,
        column: 4
      },
      end: {
        line: 1,
        column: 7
      }
    });
  });

  it("Should not report an error", async function() {
    const linter = createLinter({ "line-no-trailing-whitespace": true });
    const html = "foo   <strong>bar</strong>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error when sibling is on the same line", async function() {
    const linter = createLinter({ "line-no-trailing-whitespace": true });
    const html = "foo   <strong>bar</strong> toto";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report an error when parent close tag is on the same line", async function() {
    const linter = createLinter({ "line-no-trailing-whitespace": true });
    const html = "<p>foo   </p>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });
});

// module.exports = [
//   {
//     desc: "should match unicode spaces",
//     input: "s p a c e\u00a0\r a n d\u2007\rl i n e\u205f",
//     opts: { "line-no-trailing-whitespace": true },
//     output: 3
//   },
//   {
//     desc: "should not match empty lines with CRLF",
//     input: ["<div>", "", "</div>"].join("\r\n") + "\r\n",
//     opts: { "line-no-trailing-whitespace": true },
//     output: 0
//   }
// ];
