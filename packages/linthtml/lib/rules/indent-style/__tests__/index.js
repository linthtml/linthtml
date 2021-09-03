const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legay linter | indent-style", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  describe("\"tabs\" style", function() {
    it("Should not report any error for tab indent", async function() {
      const linter = createLinter({ "indent-style": "tabs" });
      const html = "<div>\n\t<p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for space indent", async function() {
      const linter = createLinter({ "indent-style": "tabs" });
      const html = "<div>\n <p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E024");
      expect(issues[0].rule).to.equal("indent-style");
      expect(issues[0].position).to.deep.equal({
        start: {
          line: 2,
          column: 2
        },
        end: {
          line: 2,
          column: 12
        }
      });
      expect(issues[0].data).to.deep.equal({
        current_indentation: 2,
        current_type: "spaces",
        expected_indentation: 0,
        expected_type: "tabs",
        tagName: "p"
      });
    });
  });

  describe("\"spaces\" style", function() {
    it("Should not report any error for space indent", async function() {
      const linter = createLinter({ "indent-style": "spaces" });
      const html = "<div>\n <p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for tab indent", async function() {
      const linter = createLinter({ "indent-style": "spaces" });
      const html = "<div>\n\t<p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E024");
      expect(issues[0].rule).to.equal("indent-style");
      expect(issues[0].position).to.deep.equal({
        start: {
          line: 2,
          column: 2
        },
        end: {
          line: 2,
          column: 12
        }
      });
      expect(issues[0].data).to.deep.equal({
        current_indentation: 2,
        current_type: "tabs",
        expected_indentation: 0,
        expected_type: "spaces",
        tagName: "p"
      });
    });
  });

  describe("\"nonmixed\" style", function() {
    it("Should not report any error for space indent", async function() {
      const linter = createLinter({ "indent-style": "nonmixed" });
      const html = "<div>\n <p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for tab indent", async function() {
      const linter = createLinter({ "indent-style": "nonmixed" });
      const html = "<div>\n\t<p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error when tabs and spaces are mixed on the same line", async function() {
      const linter = createLinter({ "indent-style": "nonmixed" });
      const html = "<div>\n\t <p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E024");
      expect(issues[0].rule).to.equal("indent-style");
      expect(issues[0].position).to.deep.equal({
        start: {
          line: 2,
          column: 3
        },
        end: {
          line: 2,
          column: 13
        }
      });
      expect(issues[0].data).to.deep.equal({
        current_indentation: 3,
        current_type: "mixed",
        expected_indentation: 0,
        expected_type: "nonmixed",
        tagName: "p"
      });
    });
  });

  it("Should throw an error if not given a string as config", function() {
    const linter = createLinter({ "indent-style": true });
    const html = "";
    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"indent-style\" is invalid: Expected string got boolean");
  });

  it("Should throw an error if not given a valid string as config", function() {
    const linter = createLinter({ "indent-style": "foo" });
    const html = "";
    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"indent-style\" is invalid: \"foo\" is not accepted. Accepted values are \"tabs\", \"spaces\" and \"nonmixed\".");
  });
});

describe("indent-style", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  describe("\"tabs\" style", function() {
    it("Should not report any error for tab indent", async function() {
      const linter = createLinter({
        "indent-style": [
          true,
          "tabs"
        ]
      });
      const html = "<div>\n\t<p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for space indent", async function() {
      const linter = createLinter({
        "indent-style": [
          true,
          "tabs"
        ]
      });
      const html = "<div>\n <p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E024");
      expect(issues[0].rule).to.equal("indent-style");
      expect(issues[0].position).to.deep.equal({
        start: {
          line: 2,
          column: 2
        },
        end: {
          line: 2,
          column: 12
        }
      });
      expect(issues[0].data).to.deep.equal({
        current_indentation: 2,
        current_type: "spaces",
        expected_indentation: 0,
        expected_type: "tabs",
        tagName: "p"
      });
    });
  });

  describe("\"spaces\" style", function() {
    it("Should not report any error for space indent", async function() {
      const linter = createLinter({
        "indent-style": [
          true,
          "spaces"
        ]
      });
      const html = "<div>\n <p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error for tab indent", async function() {
      const linter = createLinter({
        "indent-style": [
          true,
          "spaces"
        ]
      });
      const html = "<div>\n\t<p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E024");
      expect(issues[0].rule).to.equal("indent-style");
      expect(issues[0].position).to.deep.equal({
        start: {
          line: 2,
          column: 2
        },
        end: {
          line: 2,
          column: 12
        }
      });
      expect(issues[0].data).to.deep.equal({
        current_indentation: 2,
        current_type: "tabs",
        expected_indentation: 0,
        expected_type: "spaces",
        tagName: "p"
      });
    });
  });

  describe("\"nonmixed\" style", function() {
    it("Should not report any error for space indent", async function() {
      const linter = createLinter({
        "indent-style": [
          true,
          "nonmixed"
        ]
      });
      const html = "<div>\n <p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should not report any error for tab indent", async function() {
      const linter = createLinter({
        "indent-style": [
          true,
          "nonmixed"
        ]
      });
      const html = "<div>\n\t<p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error when tabs and spaces are mixed on the same line", async function() {
      const linter = createLinter({
        "indent-style": [
          true,
          "nonmixed"
        ]
      });
      const html = "<div>\n\t <p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E024");
      expect(issues[0].rule).to.equal("indent-style");
      expect(issues[0].position).to.deep.equal({
        start: {
          line: 2,
          column: 3
        },
        end: {
          line: 2,
          column: 13
        }
      });
      expect(issues[0].data).to.deep.equal({
        current_indentation: 3,
        current_type: "mixed",
        expected_indentation: 0,
        expected_type: "nonmixed",
        tagName: "p"
      });
    });
  });

  it("Should throw an error if not given a string as config", function() {
    const config = {
      "indent-style": [
        true,
        true
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"indent-style\" is invalid: Expected string got boolean");
  });

  it("Should throw an error if not given a valid string as config", function() {
    const config = {
      "indent-style": [
        true,
        "foo"
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"indent-style\" is invalid: \"foo\" is not accepted. Accepted values are \"tabs\", \"spaces\" and \"nonmixed\".");
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

// linter.lint(html, { "indent-style": "spaces", "indent-width": 2 }).then(issues => {
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
