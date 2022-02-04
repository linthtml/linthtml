import parse from "@linthtml/html-parser";
import { extract_inline_config } from "../../lib/inline_config";
import { expect } from "chai";
import Config from "../../lib/config";
import linthtml from "../../lib/index";
import { LegacyRuleDefinition, RuleDefinition } from "../../lib/read-config";

const fooRule: RuleDefinition = {
  name: "foo",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  lint() {}
};

function parse_comment(html: string) {
  const dom = parse(html);
  return dom.children[0];
}

describe("inline_config extraction", function () {
  it("report an error when instruction does not exist", function (done) {
    // @ts-ignore
    function report({ code, position, meta }) {
      expect(code).to.equal("INLINE_01", "Issue with code `INLINE_01` is reported");
      expect(position).to.deep.equal({
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 1,
          column: 22
        }
      });
      expect(meta).to.deep.equal({ data: { instruction: "foo" } });
      done();
    }
    const comment = parse_comment("<!-- linthtml-foo -->");
    extract_inline_config(comment, new Config(), report as any);
  });

  describe("Configure instruction", function () {
    it("report an error when configuration target a nonexistent rule ", function (done) {
      const config = new Config();
      // @ts-ignore
      function report({ code, position, meta }) {
        expect(code).to.equal("INLINE_02", "Issue with code `INLINE_02` is reported");
        expect(position).to.deep.equal({
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 1,
            column: 38
          }
        });
        expect(meta).to.deep.equal({ data: { rule_name: "foo" } });
        done();
      }
      const comment = parse_comment("<!-- linthtml-configure foo=false -->");
      extract_inline_config(comment, config, report as any);
    });

    it("return an inline config object for valid inline config (string)", function () {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment("<!-- linthtml-configure foo='bar' -->");
      const inline_config = extract_inline_config(comment, config, report as any);

      expect(inline_config.foo).to.not.be.undefined;
      expect(inline_config.foo).to.deep.equal({ config: "bar" }, "String value is extracted inside a config object");
    });

    it("return an inline config object for valid inline config (number)", function () {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment("<!-- linthtml-configure foo=2 -->");
      const inline_config = extract_inline_config(comment, config, report as any);

      expect(inline_config.foo).to.not.be.undefined;
      expect(inline_config.foo).to.deep.equal({ config: 2 }, "Number value is extracted inside a config object");
    });

    it("return an inline config object for valid inline config (json object)", function () {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment('<!-- linthtml-configure foo={"bar": "fix"} -->');
      const inline_config = extract_inline_config(comment, config, report as any);

      expect(inline_config.foo).to.not.be.undefined;
      expect(inline_config.foo).to.deep.equal(
        { config: { bar: "fix" } },
        "JSON object is extracted inside a config object"
      );
    });

    it("return an inline config object for valid inline config (array)", function () {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment('<!-- linthtml-configure foo=["bar"] -->');
      const inline_config = extract_inline_config(comment, config, report as any);

      expect(inline_config.foo).to.not.be.undefined;
      expect(inline_config.foo).to.deep.equal({ config: ["bar"] }, "JSON object is extracted inside a config object");
    });

    it("return an inline config object for valid inline config (boolean)", function () {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment("<!-- linthtml-configure foo=true -->");
      const inline_config = extract_inline_config(comment, config, report as any);

      expect(inline_config.foo).to.not.be.undefined;
      expect(inline_config.foo).to.deep.equal({ disabled: false }, "JSON object is extracted inside a config object");
    });

    it("flag rule as disabled if inline config is false", function () {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment("<!-- linthtml-configure foo=false -->");
      const inline_config = extract_inline_config(comment, config, report as any);

      expect(inline_config.foo).to.not.be.undefined;
      expect(inline_config.foo).to.deep.equal({ disabled: true });
    });

    it("flag rule as disabled if inline config is 'false' (string)", function () {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment("<!-- linthtml-configure foo='false' -->");
      const inline_config = extract_inline_config(comment, config, report as any);

      expect(inline_config.foo).to.not.be.undefined;
      expect(inline_config.foo).to.deep.equal({ disabled: true });
    });

    it("flag rule as disabled if inline config is 'off' (string)", function () {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([fooRule as LegacyRuleDefinition]);
      const comment = parse_comment("<!-- linthtml-configure foo='off' -->");
      const inline_config = extract_inline_config(comment, config, report as any);

      expect(inline_config.foo).to.not.be.undefined;
      expect(inline_config.foo).to.deep.equal({ disabled: true });
    });

    it("one instruction can contain multiple configs", function () {
      function report() {
        throw new Error("Report function should not be called for valid inline config");
      }
      const config = new Config([
        fooRule as LegacyRuleDefinition,
        {
          name: "bar",
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          lint() {}
        } as any
      ]);
      const comment = parse_comment("<!-- linthtml-configure foo='fix' bar='buz' -->");
      const inline_config = extract_inline_config(comment, config, report as any);

      expect(inline_config.foo).to.not.be.undefined;
      expect(inline_config.bar).to.not.be.undefined;
      expect(inline_config.foo).to.deep.equal({ config: "fix" });
      expect(inline_config.bar).to.deep.equal({ config: "buz" });
    });

    describe("configuration format", function () {
      it("report an error for invalid string (no quotes)", function (done) {
        const config = new Config([fooRule as LegacyRuleDefinition]);
        // @ts-ignore
        function report({ code, position, meta }) {
          expect(code).to.equal("INLINE_03", "Issue with code `INLINE_03` is reported");
          expect(position).to.deep.equal({
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 36
            }
          });
          expect(meta).to.deep.equal({ data: { rule_configuration: "bar" } });
          done();
        }
        const comment = parse_comment("<!-- linthtml-configure foo=bar -->");
        extract_inline_config(comment, config, report as any);
      });

      it("report an error for empty config (nothing after =)", function (done) {
        const config = new Config([fooRule as LegacyRuleDefinition]);
        // @ts-ignore
        function report({ code, position, meta }) {
          expect(code).to.equal("INLINE_03", "Issue with code `INLINE_03` is reported");
          expect(position).to.deep.equal({
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 33
            }
          });
          expect(meta).to.deep.equal({ data: { rule_configuration: "" } });
          done();
        }
        const comment = parse_comment("<!-- linthtml-configure foo= -->");
        extract_inline_config(comment, config, report as any);
      });

      it("report an error for invalid object config", function (done) {
        const config = new Config([fooRule as LegacyRuleDefinition]);
        // @ts-ignore
        function report({ code, position, meta }) {
          expect(code).to.equal("INLINE_03", "Issue with code `INLINE_03` is reported");
          expect(position).to.deep.equal({
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 40
            }
          });
          expect(meta).to.deep.equal({
            data: { rule_configuration: "{bar:x}" }
          });
          done();
        }
        const comment = parse_comment("<!-- linthtml-configure foo={bar:x} -->");
        extract_inline_config(comment, config, report as any);
      });

      it("report an error for invalid array config", function (done) {
        const config = new Config([fooRule as LegacyRuleDefinition]);
        // @ts-ignore
        function report({ code, position, meta }) {
          expect(code).to.equal("INLINE_03", "Issue with code `INLINE_03` is reported");
          expect(position).to.deep.equal({
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 38
            }
          });
          expect(meta).to.deep.equal({ data: { rule_configuration: "[bar]" } });
          done();
        }
        const comment = parse_comment("<!-- linthtml-configure foo=[bar] -->");
        extract_inline_config(comment, config, report as any);
      });

      it("report an error for invalid json object (no quotes on keys)", function (done) {
        const config = new Config([fooRule as LegacyRuleDefinition]);
        // @ts-ignore
        function report({ code, position, meta }) {
          expect(code).to.equal("INLINE_03", "Issue with code `INLINE_03` is reported");
          expect(position).to.deep.equal({
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 43
            }
          });
          expect(meta).to.deep.equal({
            data: { rule_configuration: "{bar: 'x'}" }
          });
          done();
        }
        const comment = parse_comment("<!-- linthtml-configure foo={bar: 'x'} -->");
        extract_inline_config(comment, config, report as any);
      });

      it("report an error for invalid json", function (done) {
        const config = new Config([fooRule as LegacyRuleDefinition]);
        // @ts-ignore
        function report({ code, position, meta }) {
          expect(code).to.equal("INLINE_03", "Issue with code `INLINE_03` is reported");
          expect(position).to.deep.equal({
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 50
            }
          });
          expect(meta).to.deep.equal({
            data: { rule_configuration: "[{'foo': 'bar'}}]" }
          });
          done();
        }
        const comment = parse_comment("<!-- linthtml-configure foo=[{'foo': 'bar'}}] -->");
        extract_inline_config(comment, config, report as any);
      });

      it("report an error if configuration does not pass rule validation", function (done) {
        const foo: RuleDefinition = {
          name: "foo",
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          lint() {},
          validateConfig() {
            throw Error("not valid");
          }
        };
        const config = new Config([foo as LegacyRuleDefinition]);
        // @ts-ignore
        function report({ code, position, meta }) {
          expect(code).to.equal("INLINE_04", "Issue with code `INLINE_03` is reported");
          expect(position).to.deep.equal({
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 38
            }
          });
          expect(meta).to.deep.equal({
            data: { rule_name: "foo", error: "not valid" }
          });
          done();
        }
        const comment = parse_comment("<!-- linthtml-configure foo='bar' -->");
        extract_inline_config(comment, config, report as any);
      });
    });
  });

  ["enable", "disable"].forEach((instruction) => {
    describe(`${instruction} instruction`, function () {
      it("report an error when configuration target a nonexistent rule ", function (done) {
        const config = new Config();
        const html = `<!-- linthtml-${instruction} foo -->`;
        // @ts-ignore
        function report({ code, position, meta }) {
          expect(code).to.equal("INLINE_02", "Issue with code `INLINE_02` is reported");
          expect(position).to.deep.equal({
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: html.length + 1
            }
          });
          expect(meta).to.deep.equal({ data: { rule_name: "foo" } });
          done();
        }
        const comment = parse_comment(html);
        extract_inline_config(comment, config, report as any);
      });

      it("return an inline config object for a valid inline config", function () {
        function report() {
          throw new Error("Report function should not be called for valid inline config");
        }
        const config = new Config([fooRule as LegacyRuleDefinition]);
        const comment = parse_comment(`<!-- linthtml-${instruction} foo -->`);
        const inline_config = extract_inline_config(comment, config, report as any);

        expect(inline_config.foo).to.not.be.undefined;
        expect(inline_config.foo).to.deep.equal({
          disabled: instruction === "disable"
        });
      });

      it("return an inline config object per rule provided", function () {
        function report() {
          throw new Error("Report function should not be called for valid inline config");
        }
        const config = new Config([
          fooRule as LegacyRuleDefinition,
          {
            name: "bar",
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            lint() {}
          } as any
        ]);
        const comment = parse_comment(`<!-- linthtml-${instruction} foo, bar -->`);
        const inline_config = extract_inline_config(comment, config, report as any);
        expect(inline_config.foo).to.not.be.undefined;
        expect(inline_config.foo).to.deep.equal({
          disabled: instruction === "disable"
        });

        expect(inline_config.bar).to.not.be.undefined;
        expect(inline_config.bar).to.deep.equal({
          disabled: instruction === "disable"
        });
      });

      it("return an inline for each activated rules when no rules are listed after the instruction", function () {
        function report() {
          throw new Error("Report function should not be called for valid inline config");
        }
        const config = new Config(
          [
            fooRule as LegacyRuleDefinition,
            {
              name: "bar",
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              lint() {}
            } as any
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
        const inline_config = extract_inline_config(comment, config, report as any);
        expect(inline_config.foo).to.not.be.undefined;
        expect(inline_config.foo).to.deep.equal({
          disabled: instruction === "disable"
        });

        expect(inline_config.bar).to.not.be.undefined;
        expect(inline_config.bar).to.deep.equal({
          disabled: instruction === "disable"
        });
      });
    });
  });
});

describe("inline_config with linter", function () {
  it("errors from inline config are returned by the linter", async function () {
    const linter = linthtml.fromConfig({ rules: {} });
    const html = "<!-- linthtml-configure foo=false -->";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0]).to.have.property("code", "INLINE_02");
  });

  it("inline config override linter config", async function () {
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
    expect(issues).to.have.lengthOf(0, "No errors are reported as inline_config disable attr-bans rule");
  });

  it("inline config only affect sibling and child nodes", async function () {
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
    expect(issues).to.have.lengthOf(
      1,
      "One error is reported as inline_config as root not is not affected by inline_config"
    );
  });

  it("(configure instruction) inline config affect siblings after declaration", async function () {
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
    expect(issues).to.have.lengthOf(1, "One error is reported as inline_config is declared after first <div>");
  });

  it("(enable|disable instruction) inline config affect siblings after declaration", async function () {
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
    expect(issues).to.have.lengthOf(1, "One error is reported as inline_config is declared after first <div>");
  });

  it("inline_config only affect rules that are activated at the linter creation", async function () {
    const linter = linthtml.fromConfig({
      rules: {}
    });

    const html = `
      <!-- linthtml-configure attr-bans=["align"] -->
      <div align></div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(
      0,
      "No errors are reported as attr-bans was not configured when linter was created"
    );
  });

  it("(configure instruction) inline_config can deactivate/activate rules", async function () {
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
    expect(issues).to.have.lengthOf(1);
  });

  it("(enable|disable instruction) inline_config can deactivate/activate rules", async function () {
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
    expect(issues).to.have.lengthOf(1);
  });

  it("enable|disable instructions only enable/disable rules and restore previous rules config", async function () {
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
    expect(issues).to.have.lengthOf(1);
  });
});
