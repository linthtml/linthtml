import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";
import path from "path";
import fs from "fs";

describe('legacy linter | "indent-style" + "indent-width"', () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  describe('"tabs" style', () => {
    it("Should not report any error when the correct number of tabs is used", async () => {
      const linter = createLinter({
        "indent-style": "tabs",
        "indent-width": 1
      });
      const html = "<div>\n\t<p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });
    it("Should not report any error when the correct number of tabs is used (complex)", async () => {
      const linter = createLinter({
        "indent-style": "tabs",
        "indent-width": 1
      });
      const html = ["<div>", "\t<h2>Foo</h2> <!-- a comment -->", "</div>"].join("\n");

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error when an incorrect number of tabs is used (to many)", async () => {
      const linter = createLinter({
        "indent-style": "tabs",
        "indent-width": 1
      });
      const html = "<div>\n\t\t<p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
      expect(issues[0].code).toBe("E036");
      expect(issues[0].rule).toBe("indent-style");
      expect(issues[0].position).toEqual({
        start: {
          line: 2,
          column: 3
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).toEqual({
        current_indentation: 2,
        expected_indentation: 1,
        isClose: false,
        tagName: "p"
      });
    });

    it("Should report an error when an incorrect number of tabs is used (not enought)", async () => {
      const linter = createLinter({
        "indent-style": "tabs",
        "indent-width": 2
      });
      const html = "<div>\n\t<p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
      expect(issues[0].code).toBe("E036");
      expect(issues[0].rule).toBe("indent-style");
      expect(issues[0].position).toEqual({
        start: {
          line: 2,
          column: 2
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).toEqual({
        current_indentation: 1,
        expected_indentation: 2,
        isClose: false,
        tagName: "p"
      });
    });
  });

  describe('"spaces" style', () => {
    it("Should not report any error when the correct number of spaces is used", async () => {
      const linter = createLinter({
        "indent-style": "spaces",
        "indent-width": 2
      });
      const html = "<div>\n  <p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error when an incorrect number of spaces is used (to many)", async () => {
      const linter = createLinter({
        "indent-style": "spaces",
        "indent-width": 1
      });
      const html = "<div>\n  <p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
      expect(issues[0].code).toBe("E036");
      expect(issues[0].rule).toBe("indent-style");
      expect(issues[0].position).toEqual({
        start: {
          line: 2,
          column: 3
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).toEqual({
        current_indentation: 2,
        expected_indentation: 1,
        isClose: false,
        tagName: "p"
      });
    });

    it("Should report an error when an incorrect number of spaces is used (not enought)", async () => {
      const linter = createLinter({
        "indent-style": "spaces",
        "indent-width": 2
      });
      const html = "<div>\n <p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
      expect(issues[0].code).toBe("E036");
      expect(issues[0].rule).toBe("indent-style");
      expect(issues[0].position).toEqual({
        start: {
          line: 2,
          column: 2
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).toEqual({
        current_indentation: 1,
        expected_indentation: 2,
        isClose: false,
        tagName: "p"
      });
    });
  });
  it("Should report an error when closing tag does not have the indent as the opening tag", async () => {
    const linter = createLinter({
      "indent-style": "spaces",
      "indent-width": 2
    });
    const html = ["<div>", "  </div>"].join("\n");

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe("E036");
    expect(issues[0].rule).toBe("indent-style");
    expect(issues[0].position).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 9
      }
    });
    expect(issues[0].data).toEqual({
      current_indentation: 2,
      expected_indentation: 0,
      isClose: true,
      tagName: "div"
    });
  });

  it("Should not report any errors (real exemple)", async () => {
    const linter = createLinter({
      "indent-style": "spaces",
      "indent-width": 2
    });
    const html = fs.readFileSync(path.resolve(__dirname, "fixtures/valid.html")).toString("utf8");

    const issues = await linter.lint(html);

    expect(issues).toHaveLength(0);
  });

  it("Should report errors (real exemple)", async () => {
    const linter = createLinter({
      "indent-style": "spaces",
      "indent-width": 2
    });
    const html = fs.readFileSync(path.resolve(__dirname, "fixtures/invalid.html")).toString("utf8");

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(6); // TODO: check all errors
  });

  it("Should throw an error if not given a number as config", () => {
    const linter = createLinter({ "indent-width": "foo" });
    const html = "";
    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "indent-width" is invalid: Expected number got string'
    );
  });

  it("Should throw an error if not given a positive number as config", () => {
    const linter = createLinter({ "indent-width": -1 });
    const html = "";
    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "indent-width" is invalid: Only positive indent value are allowed'
    );
  });
});

describe('"indent-style" + "indent-width"', () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  describe('"tabs" style', () => {
    it("Should not report any error when the correct number of tabs is used", async () => {
      const linter = createLinter({
        "indent-style": [true, "tabs"],
        "indent-width": [true, 1]
      });
      const html = "<div>\n\t<p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });
    it("Should not report any error when the correct number of tabs is used (complex)", async () => {
      const linter = createLinter({
        "indent-style": [true, "tabs"],
        "indent-width": [true, 1]
      });
      const html = ["<div>", "\t<h2>Foo</h2> <!-- a comment -->", "</div>"].join("\n");

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error when an incorrect number of tabs is used (to many)", async () => {
      const linter = createLinter({
        "indent-style": [true, "tabs"],
        "indent-width": [true, 1]
      });
      const html = "<div>\n\t\t<p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
      expect(issues[0].code).toBe("E036");
      expect(issues[0].rule).toBe("indent-style");
      expect(issues[0].position).toEqual({
        start: {
          line: 2,
          column: 3
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).toEqual({
        current_indentation: 2,
        expected_indentation: 1,
        isClose: false,
        tagName: "p"
      });
    });

    it("Should report an error when an incorrect number of tabs is used (not enought)", async () => {
      const linter = createLinter({
        "indent-style": [true, "tabs"],
        "indent-width": [true, 2]
      });
      const html = "<div>\n\t<p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
      expect(issues[0].code).toBe("E036");
      expect(issues[0].rule).toBe("indent-style");
      expect(issues[0].position).toEqual({
        start: {
          line: 2,
          column: 2
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).toEqual({
        current_indentation: 1,
        expected_indentation: 2,
        isClose: false,
        tagName: "p"
      });
    });
  });

  describe('"spaces" style', () => {
    it("Should not report any error when the correct number of spaces is used", async () => {
      const linter = createLinter({
        "indent-style": [true, "spaces"],
        "indent-width": [true, 2]
      });
      const html = "<div>\n  <p>foo</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report an error when an incorrect number of spaces is used (to many)", async () => {
      const linter = createLinter({
        "indent-style": [true, "spaces"],
        "indent-width": [true, 1]
      });
      const html = "<div>\n  <p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
      expect(issues[0].code).toBe("E036");
      expect(issues[0].rule).toBe("indent-style");
      expect(issues[0].position).toEqual({
        start: {
          line: 2,
          column: 3
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).toEqual({
        current_indentation: 2,
        expected_indentation: 1,
        isClose: false,
        tagName: "p"
      });
    });

    it("Should report an error when an incorrect number of spaces is used (not enought)", async () => {
      const linter = createLinter({
        "indent-style": [true, "spaces"],
        "indent-width": [true, 2]
      });
      const html = "<div>\n <p>foo\n</p>\n</div>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
      expect(issues[0].code).toBe("E036");
      expect(issues[0].rule).toBe("indent-style");
      expect(issues[0].position).toEqual({
        start: {
          line: 2,
          column: 2
        },
        end: {
          line: 3,
          column: 5
        }
      });
      expect(issues[0].data).toEqual({
        current_indentation: 1,
        expected_indentation: 2,
        isClose: false,
        tagName: "p"
      });
    });
  });

  it("Should report an error when closing tag does not have the indent as the opening tag", async () => {
    const linter = createLinter({
      "indent-style": [true, "spaces"],
      "indent-width": [true, 2]
    });
    const html = ["<div>", "  </div>"].join("\n");

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe("E036");
    expect(issues[0].rule).toBe("indent-style");
    expect(issues[0].position).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 9
      }
    });
    expect(issues[0].data).toEqual({
      current_indentation: 2,
      expected_indentation: 0,
      isClose: true,
      tagName: "div"
    });
  });

  it("Should not report any errors (real exemple)", async () => {
    const linter = createLinter({
      "indent-style": [true, "spaces"],
      "indent-width": [true, 2]
    });
    const html = fs.readFileSync(path.resolve(__dirname, "fixtures/valid.html")).toString("utf8");

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should report errors (real exemple)", async () => {
    const linter = createLinter({
      "indent-style": [true, "spaces"],
      "indent-width": [true, 2]
    });
    const html = fs.readFileSync(path.resolve(__dirname, "fixtures/invalid.html")).toString("utf8");

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(6); // TODO: check all errors
  });

  it("Should throw an error if not given a number as config", () => {
    const config = {
      "indent-width": [true, "foo"] as [boolean, unknown]
    };
    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "indent-width" is invalid: Expected number got string'
    );
  });

  it("Should throw an error if not given a positive number as config", () => {
    const config = {
      "indent-width": [true, -1] as [boolean, unknown]
    };
    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "indent-width" is invalid: Only positive indent value are allowed'
    );
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
