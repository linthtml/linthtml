import parse from "@linthtml/html-parser";
import { extract_inline_config } from "../../inline_config";
import Config from "../../config";
import linthtml from "../../index";
import type { LegacyRuleDefinition, RuleDefinition } from "../../read-config";
import path from "path";

const fooRule: RuleDefinition = {
  name: "foo",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  lint() {}
};

function parse_comment(html: string) {
  const dom = parse(html);
  return dom.children[0];
}

describe("inline_config extraction", () => {
  it("report an error when instruction does not exist", () => {
    const reportFn = jest.fn();

    const comment = parse_comment("<!-- linthtml-foo -->");
    extract_inline_config(comment, new Config(), reportFn);

    expect(reportFn).toHaveBeenCalledWith({
      code: "INLINE_01",
      position: {
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 1,
          column: 22
        }
      },
      meta: { data: { instruction: "foo" } }
    });
  });

  describe("Configure instruction", () => {
    it("report an error when configuration target a nonexistent rule", () => {
      const config = new Config();
      const reportFn = jest.fn();
      const comment = parse_comment("<!-- linthtml-configure foo=false -->");
      extract_inline_config(comment, config, reportFn);

      expect(reportFn).toHaveBeenCalledWith({
        code: "INLINE_02",
        position: {
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 1,
            column: 38
          }
        },
        meta: { data: { rule_name: "foo" } }
      });
    });

    it("return an inline config object for valid inline config (string)", () => {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment("<!-- linthtml-configure foo='bar' -->");
      const inline_config = extract_inline_config(comment, config, report);

      expect(inline_config.foo).toBeDefined();
      expect(inline_config.foo).toEqual({ config: "bar" });
    });

    it("return an inline config object for valid inline config (number)", () => {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment("<!-- linthtml-configure foo=2 -->");
      const inline_config = extract_inline_config(comment, config, report);

      expect(inline_config.foo).toBeDefined();
      expect(inline_config.foo).toEqual({ config: 2 });
    });

    it("return an inline config object for valid inline config (json object)", () => {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment('<!-- linthtml-configure foo={"bar": "fix"} -->');
      const inline_config = extract_inline_config(comment, config, report);

      expect(inline_config.foo).toBeDefined();
      expect(inline_config.foo).toEqual({ config: { bar: "fix" } });
    });

    it("return an inline config object for valid inline config (array)", () => {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment('<!-- linthtml-configure foo=["bar"] -->');
      const inline_config = extract_inline_config(comment, config, report);

      expect(inline_config.foo).toBeDefined();
      expect(inline_config.foo).toEqual({ config: ["bar"] });
    });

    it("return an inline config object for valid inline config (boolean)", () => {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment("<!-- linthtml-configure foo=true -->");
      const inline_config = extract_inline_config(comment, config, report);

      expect(inline_config.foo).toBeDefined();
      expect(inline_config.foo).toEqual({ disabled: false });
    });

    it("flag rule as disabled if inline config is false", () => {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment("<!-- linthtml-configure foo=false -->");
      const inline_config = extract_inline_config(comment, config, report);

      expect(inline_config.foo).toBeDefined();
      expect(inline_config.foo).toEqual({ disabled: true });
    });

    it("flag rule as disabled if inline config is 'false' (string)", () => {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment("<!-- linthtml-configure foo='false' -->");
      const inline_config = extract_inline_config(comment, config, report);

      expect(inline_config.foo).toBeDefined();
      expect(inline_config.foo).toEqual({ disabled: true });
    });

    it("flag rule as disabled if inline config is 'off' (string)", () => {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment("<!-- linthtml-configure foo='off' -->");
      const inline_config = extract_inline_config(comment, config, report);

      expect(inline_config.foo).toBeDefined();
      expect(inline_config.foo).toEqual({ disabled: true });
    });

    it("one instruction can contain multiple configs", () => {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([
        fooRule as LegacyRuleDefinition,
        {
          name: "bar",
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          lint() {},
          options: [],
          on: "",
          subscribers: []
        }
      ]);
      const comment = parse_comment("<!-- linthtml-configure foo='fix' bar='buz' -->");
      const inline_config = extract_inline_config(comment, config, report);

      expect(inline_config.foo).toBeDefined();
      expect(inline_config.bar).toBeDefined();
      expect(inline_config.foo).toEqual({ config: "fix" });
      expect(inline_config.bar).toEqual({ config: "buz" });
    });

    describe("configuration format", () => {
      it("report an error for invalid string (no quotes)", () => {
        const config = new Config([fooRule as LegacyRuleDefinition]);
        const reportFn = jest.fn();
        const comment = parse_comment("<!-- linthtml-configure foo=bar -->");
        extract_inline_config(comment, config, reportFn);
        expect(reportFn).toHaveBeenCalledWith({
          code: "INLINE_03",
          position: {
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 36
            }
          },
          meta: { data: { rule_configuration: "bar" } }
        });
      });

      it("report an error for empty config (nothing after =)", () => {
        const config = new Config([fooRule as LegacyRuleDefinition]);
        const reportFn = jest.fn();
        const comment = parse_comment("<!-- linthtml-configure foo= -->");
        extract_inline_config(comment, config, reportFn);
        expect(reportFn).toHaveBeenCalledWith({
          code: "INLINE_03",
          position: {
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 33
            }
          },
          meta: { data: { rule_configuration: "" } }
        });
      });

      it("report an error for invalid object config", () => {
        const config = new Config([fooRule as LegacyRuleDefinition]);
        const reportFn = jest.fn();
        const comment = parse_comment("<!-- linthtml-configure foo={bar:x} -->");
        extract_inline_config(comment, config, reportFn);
        expect(reportFn).toHaveBeenCalledWith({
          code: "INLINE_03",
          position: {
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 40
            }
          },
          meta: { data: { rule_configuration: "{bar:x}" } }
        });
      });

      it("report an error for invalid array config", () => {
        const config = new Config([fooRule as LegacyRuleDefinition]);
        const reportFn = jest.fn();
        const comment = parse_comment("<!-- linthtml-configure foo=[bar] -->");
        extract_inline_config(comment, config, reportFn);
        expect(reportFn).toHaveBeenCalledWith({
          code: "INLINE_03",
          position: {
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 38
            }
          },
          meta: { data: { rule_configuration: "[bar]" } }
        });
      });

      it("report an error for invalid json object (no quotes on keys)", () => {
        const config = new Config([fooRule as LegacyRuleDefinition]);
        const reportFn = jest.fn();
        const comment = parse_comment("<!-- linthtml-configure foo={bar: 'x'} -->");
        extract_inline_config(comment, config, reportFn);
        expect(reportFn).toHaveBeenCalledWith({
          code: "INLINE_03",
          position: {
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 43
            }
          },
          meta: { data: { rule_configuration: "{bar: 'x'}" } }
        });
      });

      it("report an error for invalid json", () => {
        const config = new Config([fooRule as LegacyRuleDefinition]);
        const reportFn = jest.fn();
        const comment = parse_comment("<!-- linthtml-configure foo=[{'foo': 'bar'}}] -->");
        extract_inline_config(comment, config, reportFn);
        expect(reportFn).toHaveBeenCalledWith({
          code: "INLINE_03",
          position: {
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 50
            }
          },
          meta: { data: { rule_configuration: "[{'foo': 'bar'}}]" } }
        });
      });

      it("report an error if configuration does not pass rule validation", () => {
        const foo: RuleDefinition = {
          name: "foo",
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          lint() {},
          validateConfig() {
            throw Error("not valid");
          }
        };
        const config = new Config([foo as LegacyRuleDefinition]);
        const reportFn = jest.fn();
        const comment = parse_comment("<!-- linthtml-configure foo='bar' -->");
        extract_inline_config(comment, config, reportFn);
        expect(reportFn).toHaveBeenCalledWith({
          code: "INLINE_04",
          position: {
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 38
            }
          },
          meta: { data: { rule_name: "foo", error: "not valid" } }
        });
      });
    });
  });

  ["enable", "disable"].forEach((instruction) => {
    describe(`${instruction} instruction`, () => {
      it("report an error when configuration target a nonexistent rule", () => {
        const config = new Config();
        const html = `<!-- linthtml-${instruction} foo -->`;
        const reportFn = jest.fn();
        const comment = parse_comment(html);
        extract_inline_config(comment, config, reportFn);
        expect(reportFn).toHaveBeenCalledWith({
          code: "INLINE_02",
          position: {
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: html.length + 1
            }
          },
          meta: { data: { rule_name: "foo" } }
        });
      });

      it("return an inline config object for a valid inline config", () => {
        function report() {
          throw new Error("Report function should not be called for valid inline config");
        }
        const config = new Config([fooRule as LegacyRuleDefinition]);
        const comment = parse_comment(`<!-- linthtml-${instruction} foo -->`);
        const inline_config = extract_inline_config(comment, config, report);

        expect(inline_config.foo).toBeDefined();
        expect(inline_config.foo).toEqual({
          disabled: instruction === "disable"
        });
      });

      it("return an inline config object per rule provided", () => {
        function report() {
          throw new Error("Report function should not be called for valid inline config");
        }
        const config = new Config([
          fooRule as LegacyRuleDefinition,
          {
            name: "bar",
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            lint() {},
            options: [],
            on: "",
            subscribers: []
          }
        ]);
        const comment = parse_comment(`<!-- linthtml-${instruction} foo, bar -->`);
        const inline_config = extract_inline_config(comment, config, report);
        expect(inline_config.foo).toBeDefined();
        expect(inline_config.foo).toEqual({
          disabled: instruction === "disable"
        });

        expect(inline_config.bar).toBeDefined();
        expect(inline_config.bar).toEqual({
          disabled: instruction === "disable"
        });
      });

      it("return an inline for each activated rules when no rules are listed after the instruction", () => {
        function report() {
          throw new Error("Report function should not be called for valid inline config");
        }
        const config = new Config(
          [
            fooRule as LegacyRuleDefinition,
            {
              name: "bar",
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              lint() {},
              options: [],
              on: "",
              subscribers: []
            }
          ],
          {
            // active provided rules
            rules: {
              bar: true,
              foo: true
            }
          }
        );
        const comment = parse_comment(`<!-- linthtml-${instruction} -->`);
        const inline_config = extract_inline_config(comment, config, report);
        expect(inline_config.foo).toBeDefined();
        expect(inline_config.foo).toEqual({
          disabled: instruction === "disable"
        });

        expect(inline_config.bar).toBeDefined();
        expect(inline_config.bar).toEqual({
          disabled: instruction === "disable"
        });
      });
    });
  });
});

describe("inline_config with linter", () => {
  it("errors from inline config are returned by the linter", async () => {
    const linter = linthtml.fromConfig({ rules: {} });
    const html = "<!-- linthtml-configure foo=false -->";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toHaveProperty("code", "INLINE_02");
  });

  it("inline config override linter config", async () => {
    const linter = linthtml.fromConfig({
      rules: {
        "attr-bans": [true, "align"]
      }
    });

    const html = `
      <!-- linthtml-configure attr-bans="off" -->
      <div align></div>
    `;
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("inline config only affect sibling and child nodes", async () => {
    const linter = linthtml.fromConfig({
      rules: {
        "attr-bans": [true, "align"]
      }
    });

    const html = `
      <div align>
        <!-- linthtml-configure attr-bans="off" -->
        <div align>
          <div align></div>
        </div>
      </div>
    `;
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("(configure instruction) inline config affect siblings after declaration", async () => {
    const linter = linthtml.fromConfig({
      rules: {
        "attr-bans": [true, "align"]
      }
    });

    const html = `
        <div align><div>
        <!-- linthtml-configure attr-bans="off" -->
        <div align></div>
        <div align></div>
      `;
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("(enable|disable instruction) inline config affect siblings after declaration", async () => {
    const linter = linthtml.fromConfig({
      rules: {
        "attr-bans": [true, "align"]
      }
    });

    const html = `
        <div align><div>
        <!-- linthtml-disable attr-bans -->
        <div align></div>
        <div align></div>
      `;
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("inline_config only affect rules that are activated at the linter creation", async () => {
    const linter = linthtml.fromConfig({
      rules: {}
    });

    const html = `
        <!-- linthtml-configure attr-bans=["align"] -->
        <div align></div>
      `;
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("(configure instruction) inline_config can deactivate/activate rules", async () => {
    const linter = linthtml.fromConfig({
      rules: {
        "attr-bans": [true, "align"]
      }
    });

    const html = `
        <!-- linthtml-configure attr-bans=false -->
        <div align></div>
        <!-- linthtml-configure attr-bans=true -->
        <div align></div>
      `;
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("(enable|disable instruction) inline_config can deactivate/activate rules", async () => {
    const linter = linthtml.fromConfig({
      rules: {
        "attr-bans": [true, "align"]
      }
    });

    const html = `
        <!-- linthtml-disable attr-bans -->
        <div align></div>
        <!-- linthtml-enable attr-bans -->
        <div align></div>
      `;
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("enable|disable instructions only enable/disable rules and restore previous rules config", async () => {
    const linter = linthtml.fromConfig({
      rules: {
        "attr-bans": true
      }
    });

    const html = `
        <!-- linthtml-configure attr-bans="align" -->
        <!-- linthtml-disable attr-bans -->
        <div align></div>
        <!-- linthtml-enable attr-bans -->
        <div align></div>
      `;
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });
});

describe("inline_config with linter + plugin rule", () => {
  it("rules from plugin can be configured using inline config", async () => {
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.js");
    const linter = linthtml.from_config_path(config_path);
    const html = ["Some text", "<!-- linthtml-configure my-plugin/rule=false -->", "<div></div>"].join("\n");

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1); // One error for the text tag "Some text"
  });
  it("rules from plugin can be disabled using inline config", async () => {
    const config_path = path.join(__dirname, "fixtures", "valid-config-plugin.js");
    const linter = linthtml.from_config_path(config_path);
    const html = ["Some text", "<!-- linthtml-disable my-plugin/rule -->", "<div></div>"].join("\n");

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1); // One error for the text tag "Some text"
  });
});
