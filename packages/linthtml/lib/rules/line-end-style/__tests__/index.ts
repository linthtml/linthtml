import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | line-end-style", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  describe('"cr" mode', () => {
    it("Should not report any errors for valid end line", async () => {
      const linter = createLinter({ "line-end-style": "cr" });
      const html = ["<body>\r", "  <p>\r", "    some text\r", "  </p>\r", "</body>\r"].join("");

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report errors for invalid end line", async () => {
      const linter = createLinter({ "line-end-style": "cr" });
      const html = ["<body>\n", "  <p>\r", "    some text\r", "  </p>\r", "</body>\r"].join("");
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
      expect(issues[0].position).toEqual({
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 1,
          column: 8
        }
      });
    });
  });
  describe('"lf" mode', () => {
    it("Should report errors for invalid end line", async () => {
      const linter = createLinter({ "line-end-style": "lf" });
      const html = ["<body>\n", "  <p>\n", "    some text\n", "  </p>\n", "</body>\n"].join("");

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should not report any error for valid end line", async () => {
      const linter = createLinter({ "line-end-style": "lf" });
      const html = ["<body>\n", "  <p>\r", "    some text\r", "  </p>\r", "</body>\r"].join("");

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(4);
      expect(issues[0].position).toEqual({
        start: {
          line: 2,
          column: 1
        },
        end: {
          line: 2,
          column: 7
        }
      });
      expect(issues[1].position).toEqual({
        start: {
          line: 3,
          column: 1
        },
        end: {
          line: 3,
          column: 15
        }
      });
      expect(issues[2].position).toEqual({
        start: {
          line: 4,
          column: 1
        },
        end: {
          line: 4,
          column: 8
        }
      });
      expect(issues[3].position).toEqual({
        start: {
          line: 5,
          column: 1
        },
        end: {
          line: 5,
          column: 9
        }
      });
    });
  });
  describe('"crlf" mode', () => {
    it("Should report errors for invalid end line", async () => {
      const linter = createLinter({ "line-end-style": "crlf" });
      const html = ["<body>\r\n", "  <p>\r\n", "    some text\r\n", "  </p>\r\n", "</body>\r\n"].join("");

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should not report any error for valid end line", async () => {
      const linter = createLinter({ "line-end-style": "crlf" });
      const html = ["<body>\r\n", "  <p>\r\n", "    some text\r", "  </p>\r\n", "</body>\r\n"].join("");

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
      expect(issues[0].position).toEqual({
        start: {
          line: 3,
          column: 1
        },
        end: {
          line: 3,
          column: 15
        }
      });
    });
  });

  it(
    "Should not report any error for just one line without end char",
    async () => {
      const linter = createLinter({ "line-end-style": "lf" });
      const html = "<p>foo</p>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it("Should throw an error for invalid config (not valid type)", () => {
    const linter = createLinter({ "line-end-style": 0 });
    const html = "";

    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "line-end-style" is invalid: Expected string got number.'
    );
  });

  it("Should throw an error for invalid config (not valid string)", () => {
    const linter = createLinter({ "line-end-style": "foo" });
    const html = "";

    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "line-end-style" is invalid: "foo" is not accepted. Accepted values are "cr", "lf" and "crlf".'
    );
  });
});

describe("line-end-style", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  describe('"cr" mode', () => {
    it("Should not report any errors for valid end line", async () => {
      const linter = createLinter({
        "line-end-style": [true, "cr"]
      });
      const html = ["<body>\r", "  <p>\r", "    some text\r", "  </p>\r", "</body>\r"].join("");

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should report errors for invalid end line", async () => {
      const linter = createLinter({
        "line-end-style": [true, "cr"]
      });
      const html = ["<body>\n", "  <p>\r", "    some text\r", "  </p>\r", "</body>\r"].join("");
      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });
  describe('"lf" mode', () => {
    it("Should report errors for invalid end line", async () => {
      const linter = createLinter({
        "line-end-style": [true, "lf"]
      });
      const html = ["<body>\n", "  <p>\n", "    some text\n", "  </p>\n", "</body>\n"].join("");

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should not report any error for valid end line", async () => {
      const linter = createLinter({
        "line-end-style": [true, "lf"]
      });
      const html = ["<body>\n", "  <p>\r", "    some text\r", "  </p>\r", "</body>\r"].join("");

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(4);
    });
  });
  describe('"crlf" mode', () => {
    it("Should report errors for invalid end line", async () => {
      const linter = createLinter({
        "line-end-style": [true, "crlf"]
      });
      const html = ["<body>\r\n", "  <p>\r\n", "    some text\r\n", "  </p>\r\n", "</body>\r\n"].join("");

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    });

    it("Should not report any error for valid end line", async () => {
      const linter = createLinter({
        "line-end-style": [true, "crlf"]
      });
      const html = ["<body>\r\n", "  <p>\r\n", "    some text\r", "  </p>\r\n", "</body>\r\n"].join("");

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    });
  });

  it(
    "Should not report any error for just one line without end char",
    async () => {
      const linter = createLinter({
        "line-end-style": [true, "lf"]
      });
      const html = "<p>foo</p>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it("Should throw an error for invalid config (not valid type)", () => {
    const config = {
      "line-end-style": [true, 0] as [boolean, unknown]
    };
    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "line-end-style" is invalid: Expected string got number.'
    );
  });

  it("Should throw an error for invalid config (not valid string)", () => {
    const config = {
      "line-end-style": [true, "foo"] as [boolean, unknown]
    };
    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "line-end-style" is invalid: "foo" is not accepted. Accepted values are "cr", "lf" and "crlf".'
    );
  });
});
