import linthtml from "../../../index";
import { presets } from "../../../presets";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config";

describe("legacy linter | line-max-len", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it(
    "Should not report any error when the line does not exceed the max length",
    async () => {
      const linter = createLinter({ "line-max-len": 5 });
      const html = "1234";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it(
    "Should not report any error when the line length equal the max length",
    async () => {
      const linter = createLinter({ "line-max-len": 5 });
      const html = "12345";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it("Should support multilines", async () => {
    const linter = createLinter({ "line-max-len": 5 });
    const html = "12345\n12345\n1234";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it(
    "Should report an error when the line does exceed the max length",
    async () => {
      const linter = createLinter({ "line-max-len": 5 });
      const html = "123456";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it(
    "Should report an error when the line exceed the max length (html tag)",
    async () => {
      const linter = createLinter({ "line-max-len": 5 });
      const html = "<span></span>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it("Should report only on error per line (html tag)", async () => {
    const linter = createLinter({ "line-max-len": 5 });
    const html = "<div><span></span></div>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("should report errors", async () => {
    const linter = createLinter({ "line-max-len": 5 });
    const html = ["<div><span>", "</span></div>"].join("\n");

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("should report errors", async () => {
    const linter = createLinter({ "line-max-len": 3 });
    const html = ["<div>", "<span></span>", "</div>"].join("\n");

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(3);
  });

  it("should report errors", async () => {
    const linter = createLinter({ "line-max-len": 3 });
    const html = ["<div>foo", "<span></span>", "</div>"].join("\n");

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(3);
  });

  it("Should throw an error if not given a number as config", () => {
    const linter = createLinter({ "line-max-len": "foo" });
    const html = "";
    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "line-max-len" is invalid: Expected number got string'
    );
  });

  it(
    "Should throw an error if not given a positive number as config",
    () => {
      const linter = createLinter({ "line-max-len": -1 });
      const html = "";
      expect(() => linter.lint(html)).toThrow(
        'Configuration for rule "line-max-len" is invalid: Only positive indent value are allowed.'
      );
    }
  );
});
describe("line-max-len", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it(
    "Should not report any error when the line does not exceed the max length",
    async () => {
      const linter = createLinter({
        "line-max-len": [true, 5]
      });
      const html = "1234";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it(
    "Should report an error when the line exceed the max length (html tag)",
    async () => {
      const linter = createLinter({
        "line-max-len": [true, 5]
      });
      const html = "<span></span>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it("Should report only on error per line (html tag)", async () => {
    const linter = createLinter({
      "line-max-len": [true, 5]
    });
    const html = "<div><span></span></div>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("should report errors", async () => {
    const linter = createLinter({
      "line-max-len": [true, 5]
    });
    const html = ["<div><span>", "</span></div>"].join("\n");

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it("should report errors", async () => {
    const linter = createLinter({
      "line-max-len": [true, 3]
    });
    const html = ["<div>", "<span></span>", "</div>"].join("\n");

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(3);
  });

  it("should report errors", async () => {
    const linter = createLinter({
      "line-max-len": [true, 5]
    });
    const html = ["<div>foo", "<span></span>", "</div>"].join("\n");

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(3);
  });

  it(
    "Should not report any error when the line length equal the max length",
    async () => {
      const linter = createLinter({
        "line-max-len": [true, 5]
      });
      const html = "12345";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it("Should support multilines", async () => {
    const linter = createLinter({
      "line-max-len": [true, 5]
    });
    const html = "12345\n12345\n1234";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it(
    "Should report an error when the line does exceed the max length",
    async () => {
      const linter = createLinter({
        "line-max-len": [true, 5]
      });
      const html = "123456";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it("Should throw an error if not given a number as config", () => {
    const config = {
      "line-max-len": [true, "foo"] as [boolean, unknown]
    };
    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "line-max-len" is invalid: Expected number got string'
    );
  });

  it(
    "Should throw an error if not given a positive number as config",
    () => {
      const config = {
        "line-max-len": [true, -1] as [boolean, unknown]
      };
      expect(() => createLinter(config)).toThrow(
        'Configuration for rule "line-max-len" is invalid: Only positive indent value are allowed.'
      );
    }
  );
});

// module.exports = [
//   {
//     desc: "should pass when line length matches ignore-regex",
//     input: '<a href="http://www.google.com">12345</a>',
//     opts: { "line-max-len": 5, "line-max-len-ignore-regex": "href" },
//     output: 0
//   }
// ];
