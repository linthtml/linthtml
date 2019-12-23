const { expect } = require("chai");
const linthtml = require("../../../index");
const path = require("path");
const fs = require("fs");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}

describe("indent-style", function() {
  describe("\"tabs\" style", function() {
    it("Should not report any error for tab indent", async function() {
      const linter = createLinter();
      const html = "<div>\n\t<p>foo</p>\n</div>";

      const issues = await linter.lint(html, none, { "indent-style": "tabs" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for space indent", async function() {
      const linter = createLinter();
      const html = "<div>\n <p>foo</p>\n</div>";

      const issues = await linter.lint(html, none, { "indent-style": "tabs" });
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("\"spaces\" style", function() {
    it("Should not report any error for space indent", async function() {
      const linter = createLinter();
      const html = "<div>\n <p>foo</p>\n</div>";

      const issues = await linter.lint(html, none, { "indent-style": "spaces" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for tab indent", async function() {
      const linter = createLinter();
      const html = "<div>\n\t<p>foo</p>\n</div>";

      const issues = await linter.lint(html, none, { "indent-style": "spaces" });
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("\"nonmixed\" style", function() {
    it("Should not report any error for space indent", async function() {
      const linter = createLinter();
      const html = "<div>\n <p>foo</p>\n</div>";

      const issues = await linter.lint(html, none, { "indent-style": "nonmixed" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for tab indent", async function() {
      const linter = createLinter();
      const html = "<div>\n\t<p>foo</p>\n</div>";

      const issues = await linter.lint(html, none, { "indent-style": "nonmixed" });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error when tabs and spaces are mixed on the same line", async function() {
      const linter = createLinter();
      const html = "<div>\n\t <p>foo</p>\n</div>";

      const issues = await linter.lint(html, none, { "indent-style": "nonmixed" });
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should throw an error if not given a string as config", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "indent-style": true }))
      .to
      .throw("Configuration for rule \"indent-style\" is invalid: Expected string got boolean");
  });

  it("Should throw an error if not given a valid string as config", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "indent-style": "foo" }))
      .to
      .throw("Configuration for rule \"indent-style\" is invalid: Indent style \"foo\" is not valid. Valid indent styles are \"tabs\", \"spaces\" and \"nonmixed\"");
  });
});

describe("\"indent-style\" + \"indent-width\"", function() {
  describe("\"tabs\" style", function() {
    it("Should not report any error when the correct number of tabs is used", async function() {
      const linter = createLinter();
      const html = "<div>\n\t<p>foo</p>\n</div>";

      const issues = await linter.lint(html, none, { "indent-style": "tabs", "indent-width": 1 });
      expect(issues).to.have.lengthOf(0);
    });
    it("Should not report any error when the correct number of tabs is used (complex)", async function() {
      const linter = createLinter();
      const html = [
        "<div>",
        "\t<h2>Foo</h2> <!-- a comment -->",
        "</div>"
      ].join("\n");

      const issues = await linter.lint(html, none, { "indent-style": "tabs", "indent-width": 1 });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error when an incorrect number of tabs is used (to many)", async function() {
      const linter = createLinter();
      const html = "<div>\n\t\t<p>foo\n</p>\n</div>";

      const issues = await linter.lint(html, none, { "indent-style": "tabs", "indent-width": 1 });
      expect(issues).to.have.lengthOf(1);
    });

    it("Should report an error when an incorrect number of tabs is used (not enought)", async function() {
      const linter = createLinter();
      const html = "<div>\n\t<p>foo\n</p>\n</div>";

      const issues = await linter.lint(html, none, { "indent-style": "tabs", "indent-width": 2 });
      expect(issues).to.have.lengthOf(1);
    });
  });

  describe("\"spaces\" style", function() {
    it("Should not report any error when the correct number of spaces is used", async function() {
      const linter = createLinter();
      const html = "<div>\n  <p>foo</p>\n</div>";

      const issues = await linter.lint(html, none, { "indent-style": "spaces", "indent-width": 2 });
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error when an incorrect number of spaces is used (to many)", async function() {
      const linter = createLinter();
      const html = "<div>\n  <p>foo\n</p>\n</div>";

      const issues = await linter.lint(html, none, { "indent-style": "spaces", "indent-width": 1 });
      expect(issues).to.have.lengthOf(1);
    });

    it("Should report an error when an incorrect number of spaces is used (not enought)", async function() {
      const linter = createLinter();
      const html = "<div>\n <p>foo\n</p>\n</div>";

      const issues = await linter.lint(html, none, { "indent-style": "spaces", "indent-width": 2 });
      expect(issues).to.have.lengthOf(1);
    });
  });

  it("Should not report any errors (real exemple)", async function() {
    const linter = createLinter();
    const html = fs.readFileSync(path.resolve(__dirname, "fixtures/valid.html")).toString("utf8");

    const issues = await linter.lint(html, none, { "indent-style": "spaces", "indent-width": 2 });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors (real exemple)", async function() {
    const linter = createLinter();
    const html = fs.readFileSync(path.resolve(__dirname, "fixtures/invalid.html")).toString("utf8");

    const issues = await linter.lint(html, none, { "indent-style": "spaces", "indent-width": 2 });
    expect(issues).to.have.lengthOf(4);
  });

  it("Should throw an error if not given a number as config", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "indent-width": "foo" }))
      .to
      .throw("Configuration for rule \"indent-width\" is invalid: Expected number got string");
  });

  it("Should throw an error if not given a positive number as config", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "indent-width": -1 }))
      .to
      .throw("Configuration for rule \"indent-width\" is invalid: Only positive indent value are allowed");
  });
});

// // //shoult report an error
// // <div><p></p>
// //   <p></p><p></p>
// // </div>

// const linter = createLinter();
// const html = [
//   "<div>",
//   "  <div>",
//   "    <p></p>",
//   "  </div>",
//   "  <p></p>",
//   "  <p></p><p></p>",
//   "</div>"
// ].join('\n\r');

// linter.lint(html, none, { "indent-style": "spaces", "indent-width": 2 }).then(issues => {
//   console.log(issues)
// });

// // //shoult not report an error
// // <div>
// //   <p></p>
// //   <p></p><p></p>
// // </div>

// // //shoult not report an error
// // <div>
// //   <p></p><p></p><p></p>
// // </div>

// // //shoult not report an error
// // <div><p></p><p></p><p></p></div>
