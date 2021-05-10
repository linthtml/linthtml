const { expect } = require("chai");
const linthtml = require("../../../index");
const path = require("path");
const fs = require("fs");
const none = require("../../../presets").presets.none;

describe("legacy linter | \"indent-style\" + \"indent-width\"", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  describe("\"tabs\" style", function() {
    it("Should not report any error when the correct number of tabs is used", async function() {
      const linter = createLinter({ "indent-style": "tabs", "indent-width": 1 });
      const html = "<div>\n\t<p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });
    it("Should not report any error when the correct number of tabs is used (complex)", async function() {
      const linter = createLinter({ "indent-style": "tabs", "indent-width": 1 });
      const html = [
        "<div>",
        "\t<h2>Foo</h2> <!-- a comment -->",
        "</div>"
      ].join("\n");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error when an incorrect number of tabs is used (to many)", async function() {
      const linter = createLinter({ "indent-style": "tabs", "indent-width": 1 });
      const html = "<div>\n\t\t<p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E036");
      expect(issues[0].rule).to.equal("indent-style");
      expect(issues[0].position).to.deep.equal({
        start: {
          line: 2,
          column: 3
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).to.deep.equal({
        current_indentation: 2,
        expected_indentation: 1,
        isClose: false,
        tagName: "p"
      });
    });

    it("Should report an error when an incorrect number of tabs is used (not enought)", async function() {
      const linter = createLinter({ "indent-style": "tabs", "indent-width": 2 });
      const html = "<div>\n\t<p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E036");
      expect(issues[0].rule).to.equal("indent-style");
      expect(issues[0].position).to.deep.equal({
        start: {
          line: 2,
          column: 2
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).to.deep.equal({
        current_indentation: 1,
        expected_indentation: 2,
        isClose: false,
        tagName: "p"
      });
    });
  });

  describe("\"spaces\" style", function() {
    it("Should not report any error when the correct number of spaces is used", async function() {
      const linter = createLinter({ "indent-style": "spaces", "indent-width": 2 });
      const html = "<div>\n  <p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error when an incorrect number of spaces is used (to many)", async function() {
      const linter = createLinter({ "indent-style": "spaces", "indent-width": 1 });
      const html = "<div>\n  <p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E036");
      expect(issues[0].rule).to.equal("indent-style");
      expect(issues[0].position).to.deep.equal({
        start: {
          line: 2,
          column: 3
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).to.deep.equal({
        current_indentation: 2,
        expected_indentation: 1,
        isClose: false,
        tagName: "p"
      });
    });

    it("Should report an error when an incorrect number of spaces is used (not enought)", async function() {
      const linter = createLinter({ "indent-style": "spaces", "indent-width": 2 });
      const html = "<div>\n <p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E036");
      expect(issues[0].rule).to.equal("indent-style");
      expect(issues[0].position).to.deep.equal({
        start: {
          line: 2,
          column: 2
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).to.deep.equal({
        current_indentation: 1,
        expected_indentation: 2,
        isClose: false,
        tagName: "p"
      });
    });
  });
  it("Should report an error when closing tag does not have the indent as the opening tag", async function() {
    const linter = createLinter({ "indent-style": "spaces", "indent-width": 2 });
    const html = [
      "<div>",
      "  </div>"
    ].join("\n");

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].code).to.equal("E036");
    expect(issues[0].rule).to.equal("indent-style");
    expect(issues[0].position).to.deep.equal({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 9
      }
    });
    expect(issues[0].data).to.deep.equal({
      current_indentation: 2,
      expected_indentation: 0,
      isClose: true,
      tagName: "div"
    });
  });

  it("Should not report any errors (real exemple)", async function() {
    const linter = createLinter({ "indent-style": "spaces", "indent-width": 2 });
    const html = fs.readFileSync(path.resolve(__dirname, "fixtures/valid.html")).toString("utf8");

    const issues = await linter.lint(html);

    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors (real exemple)", async function() {
    const linter = createLinter({ "indent-style": "spaces", "indent-width": 2 });
    const html = fs.readFileSync(path.resolve(__dirname, "fixtures/invalid.html")).toString("utf8");

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(6); // TODO: check all errors
  });

  it("Should throw an error if not given a number as config", function() {
    const linter = createLinter({ "indent-width": "foo" });
    const html = "";
    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"indent-width\" is invalid: Expected number got string");
  });

  it("Should throw an error if not given a positive number as config", function() {
    const linter = createLinter({ "indent-width": -1 });
    const html = "";
    expect(() => linter.lint(html))
      .to
      .throw("Configuration for rule \"indent-width\" is invalid: Only positive indent value are allowed");
  });
});

describe("\"indent-style\" + \"indent-width\"", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  describe("\"tabs\" style", function() {
    it("Should not report any error when the correct number of tabs is used", async function() {
      const linter = createLinter({
        "indent-style": [
          true,
          "tabs"
        ],
        "indent-width": [
          true,
          1
        ]
      });
      const html = "<div>\n\t<p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });
    it("Should not report any error when the correct number of tabs is used (complex)", async function() {
      const linter = createLinter({
        "indent-style": [
          true,
          "tabs"
        ],
        "indent-width": [
          true,
          1
        ]
      });
      const html = [
        "<div>",
        "\t<h2>Foo</h2> <!-- a comment -->",
        "</div>"
      ].join("\n");

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error when an incorrect number of tabs is used (to many)", async function() {
      const linter = createLinter({
        "indent-style": [
          true,
          "tabs"
        ],
        "indent-width": [
          true,
          1
        ]
      });
      const html = "<div>\n\t\t<p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E036");
      expect(issues[0].rule).to.equal("indent-style");
      expect(issues[0].position).to.deep.equal({
        start: {
          line: 2,
          column: 3
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).to.deep.equal({
        current_indentation: 2,
        expected_indentation: 1,
        isClose: false,
        tagName: "p"
      });
    });

    it("Should report an error when an incorrect number of tabs is used (not enought)", async function() {
      const linter = createLinter({
        "indent-style": [
          true,
          "tabs"
        ],
        "indent-width": [
          true,
          2
        ]
      });
      const html = "<div>\n\t<p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E036");
      expect(issues[0].rule).to.equal("indent-style");
      expect(issues[0].position).to.deep.equal({
        start: {
          line: 2,
          column: 2
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).to.deep.equal({
        current_indentation: 1,
        expected_indentation: 2,
        isClose: false,
        tagName: "p"
      });
    });
  });

  describe("\"spaces\" style", function() {
    it("Should not report any error when the correct number of spaces is used", async function() {
      const linter = createLinter({
        "indent-style": [
          true,
          "spaces"
        ],
        "indent-width": [
          true,
          2
        ]
      });
      const html = "<div>\n  <p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });

    it("Should report an error when an incorrect number of spaces is used (to many)", async function() {
      const linter = createLinter({
        "indent-style": [
          true,
          "spaces"
        ],
        "indent-width": [
          true,
          1
        ]
      });
      const html = "<div>\n  <p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E036");
      expect(issues[0].rule).to.equal("indent-style");
      expect(issues[0].position).to.deep.equal({
        start: {
          line: 2,
          column: 3
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).to.deep.equal({
        current_indentation: 2,
        expected_indentation: 1,
        isClose: false,
        tagName: "p"
      });
    });

    it("Should report an error when an incorrect number of spaces is used (not enought)", async function() {
      const linter = createLinter({
        "indent-style": [
          true,
          "spaces"
        ],
        "indent-width": [
          true,
          2
        ]
      });
      const html = "<div>\n <p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(1);
      expect(issues[0].code).to.equal("E036");
      expect(issues[0].rule).to.equal("indent-style");
      expect(issues[0].position).to.deep.equal({
        start: {
          line: 2,
          column: 2
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).to.deep.equal({
        current_indentation: 1,
        expected_indentation: 2,
        isClose: false,
        tagName: "p"
      });
    });
  });

  it("Should report an error when closing tag does not have the indent as the opening tag", async function() {
    const linter = createLinter({
      "indent-style": [
        true,
        "spaces"
      ],
      "indent-width": [
        true,
        2
      ]
    });
    const html = [
      "<div>",
      "  </div>"
    ].join("\n");

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].code).to.equal("E036");
    expect(issues[0].rule).to.equal("indent-style");
    expect(issues[0].position).to.deep.equal({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 9
      }
    });
    expect(issues[0].data).to.deep.equal({
      current_indentation: 2,
      expected_indentation: 0,
      isClose: true,
      tagName: "div"
    });
  });

  it("Should not report any errors (real exemple)", async function() {
    const linter = createLinter({
      "indent-style": [
        true,
        "spaces"
      ],
      "indent-width": [
        true,
        2
      ]
    });
    const html = fs.readFileSync(path.resolve(__dirname, "fixtures/valid.html")).toString("utf8");

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors (real exemple)", async function() {
    const linter = createLinter({
      "indent-style": [
        true,
        "spaces"
      ],
      "indent-width": [
        true,
        2
      ]
    });
    const html = fs.readFileSync(path.resolve(__dirname, "fixtures/invalid.html")).toString("utf8");

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(6); // TODO: check all errors
  });

  it("Should throw an error if not given a number as config", function() {
    const config = {
      "indent-width": [
        true,
        "foo"
      ]
    };
    expect(() => createLinter(config))
      .to
      .throw("Configuration for rule \"indent-width\" is invalid: Expected number got string");
  });

  it("Should throw an error if not given a positive number as config", function() {
    const config = {
      "indent-width": [
        true,
        -1
      ]
    };
    expect(() => createLinter(config))
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
