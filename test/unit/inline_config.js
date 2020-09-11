const parse = require("../../lib/parser");
const { extract_inline_config } = require("../../lib/inline_config");
const { expect } = require("chai");
const Config = require("../../lib/config");
const linthtml = require("../../lib/index");

const fooRule = {
  name: "foo",
  lint() {}
};

describe("inline_config extraction", function() {
  it("report an error when instruction does not exist", function(done) {
    function report({ code, position, meta }) {
      expect(code).to.equal("INLINE_01", "Issue with code `INLINE_01` is reported");
      expect(position)
        .to
        .deep
        .equal({
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
    const comment = parse("<!-- linthtml-foo -->")[0];
    extract_inline_config(comment, {}, report);
  });

  it("report an error when configuration target a nonexistent rule ", function(done) {
    const config = new Config({});
    function report({ code, position, meta }) {
      expect(code).to.equal("INLINE_02", "Issue with code `INLINE_02` is reported");
      expect(position)
        .to
        .deep
        .equal({
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
    const comment = parse("<!-- linthtml-configure foo=false -->")[0];
    extract_inline_config(comment, config, report);
  });

  it("return an inline config object for valid inline config (string)", function() {
    function report() {
      throw new Error("Report function should not be called for valid inline config");
    }
    const config = new Config({ fooRule });
    const comment = parse("<!-- linthtml-configure foo='bar' -->")[0];
    const inline_config = extract_inline_config(comment, config, report);

    expect(inline_config.foo).to.not.be.undefined;
    expect(inline_config.foo).to.deep.equal({ config: "bar" }, "String value is extracted inside a config object");
  });

  it("return an inline config object for valid inline config (number)", function() {
    function report() {
      throw new Error("Report function should not be called for valid inline config");
    }
    const config = new Config({ fooRule });
    const comment = parse("<!-- linthtml-configure foo=2 -->")[0];
    const inline_config = extract_inline_config(comment, config, report);

    expect(inline_config.foo).to.not.be.undefined;
    expect(inline_config.foo).to.deep.equal({ config: 2 }, "Number value is extracted inside a config object");
  });

  it("return an inline config object for valid inline config (json object)", function() {
    function report() {
      throw new Error("Report function should not be called for valid inline config");
    }
    const config = new Config({ fooRule });
    const comment = parse("<!-- linthtml-configure foo={\"bar\": \"fix\"} -->")[0];
    const inline_config = extract_inline_config(comment, config, report);

    expect(inline_config.foo).to.not.be.undefined;
    expect(inline_config.foo).to.deep.equal({ config: { bar: "fix" } }, "JSON object is extracted inside a config object");
  });

  it("return an inline config object for valid inline config (array)", function() {
    function report() {
      throw new Error("Report function should not be called for valid inline config");
    }
    const config = new Config({ fooRule });
    const comment = parse("<!-- linthtml-configure foo=[\"bar\"] -->")[0];
    const inline_config = extract_inline_config(comment, config, report);

    expect(inline_config.foo).to.not.be.undefined;
    expect(inline_config.foo).to.deep.equal({ config: ["bar"] }, "JSON object is extracted inside a config object");
  });

  it("return an inline config object for valid inline config (boolean)", function() {
    function report() {
      throw new Error("Report function should not be called for valid inline config");
    }
    const config = new Config({ fooRule });
    const comment = parse("<!-- linthtml-configure foo=true -->")[0];
    const inline_config = extract_inline_config(comment, config, report);

    expect(inline_config.foo).to.not.be.undefined;
    expect(inline_config.foo).to.deep.equal({ disabled: false }, "JSON object is extracted inside a config object");
  });

  it("flag rule as disabled if inline config is false", function() {
    function report() {
      throw new Error("Report function should not be called for valid inline config");
    }
    const config = new Config({ fooRule });
    const comment = parse("<!-- linthtml-configure foo=false -->")[0];
    const inline_config = extract_inline_config(comment, config, report);

    expect(inline_config.foo).to.not.be.undefined;
    expect(inline_config.foo).to.deep.equal({ disabled: true });
  });

  it("flag rule as disabled if inline config is 'false' (string)", function() {
    function report() {
      throw new Error("Report function should not be called for valid inline config");
    }
    const config = new Config({ fooRule });
    const comment = parse("<!-- linthtml-configure foo='false' -->")[0];
    const inline_config = extract_inline_config(comment, config, report);

    expect(inline_config.foo).to.not.be.undefined;
    expect(inline_config.foo).to.deep.equal({ disabled: true });
  });

  it("flag rule as disabled if inline config is 'off' (string)", function() {
    function report() {
      throw new Error("Report function should not be called for valid inline config");
    }
    const config = new Config({ fooRule });
    const comment = parse("<!-- linthtml-configure foo='off' -->")[0];
    const inline_config = extract_inline_config(comment, config, report);

    expect(inline_config.foo).to.not.be.undefined;
    expect(inline_config.foo).to.deep.equal({ disabled: true });
  });

  it("one instruction can contain configs", function() {
    function report() {
      throw new Error("Report function should not be called for valid inline config");
    }
    const config = new Config({
      fooRule,
      bar: {
        name: "bar",
        lint() {}
      }
    });
    const comment = parse("<!-- linthtml-configure foo='fix' bar='buz' -->")[0];
    const inline_config = extract_inline_config(comment, config, report);

    expect(inline_config.foo).to.not.be.undefined;
    expect(inline_config.bar).to.not.be.undefined;
    expect(inline_config.foo).to.deep.equal({ config: "fix" });
    expect(inline_config.bar).to.deep.equal({ config: "buz" });
  });

  describe("configuration format", function() {
    it("report an error for invalid string (no quotes)", function(done) {
      const config = new Config({ fooRule });
      function report({ code, position, meta }) {
        expect(code).to.equal("INLINE_03", "Issue with code `INLINE_03` is reported");
        expect(position)
          .to
          .deep
          .equal({
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
      const comment = parse("<!-- linthtml-configure foo=bar -->")[0];
      extract_inline_config(comment, config, report);
    });

    it("report an error for empty config (nothing after =)", function(done) {
      const config = new Config({ fooRule });
      function report({ code, position, meta }) {
        expect(code).to.equal("INLINE_03", "Issue with code `INLINE_03` is reported");
        expect(position)
          .to
          .deep
          .equal({
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
      const comment = parse("<!-- linthtml-configure foo= -->")[0];
      extract_inline_config(comment, config, report);
    });

    it("report an error for invalid object config", function(done) {
      const config = new Config({ fooRule });
      function report({ code, position, meta }) {
        expect(code).to.equal("INLINE_03", "Issue with code `INLINE_03` is reported");
        expect(position)
          .to
          .deep
          .equal({
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 40
            }
          });
        expect(meta).to.deep.equal({ data: { rule_configuration: "{bar:x}" } });
        done();
      }
      const comment = parse("<!-- linthtml-configure foo={bar:x} -->")[0];
      extract_inline_config(comment, config, report);
    });

    it("report an error for invalid array config", function(done) {
      const config = new Config({ fooRule });
      function report({ code, position, meta }) {
        expect(code).to.equal("INLINE_03", "Issue with code `INLINE_03` is reported");
        expect(position)
          .to
          .deep
          .equal({
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
      const comment = parse("<!-- linthtml-configure foo=[bar] -->")[0];
      extract_inline_config(comment, config, report);
    });

    it("report an error for invalid json object (no quotes on keys)", function(done) {
      const config = new Config({ fooRule });
      function report({ code, position, meta }) {
        expect(code).to.equal("INLINE_03", "Issue with code `INLINE_03` is reported");
        expect(position)
          .to
          .deep
          .equal({
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 43
            }
          });
        expect(meta).to.deep.equal({ data: { rule_configuration: "{bar: 'x'}" } });
        done();
      }
      const comment = parse("<!-- linthtml-configure foo={bar: 'x'} -->")[0];
      extract_inline_config(comment, config, report);
    });

    it("report an error for invalid json", function(done) {
      const config = new Config({ fooRule });
      function report({ code, position, meta }) {
        expect(code).to.equal("INLINE_03", "Issue with code `INLINE_03` is reported");
        expect(position)
          .to
          .deep
          .equal({
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 50
            }
          });
        expect(meta).to.deep.equal({ data: { rule_configuration: "[{'foo': 'bar'}}]" } });
        done();
      }
      const comment = parse("<!-- linthtml-configure foo=[{'foo': 'bar'}}] -->")[0];
      extract_inline_config(comment, config, report);
    });

    it("report an error if configuration does not pass rule validation", function(done) {
      const foo = {
        name: "foo",
        lint() {},
        validateConfig() {
          throw Error("not valid");
        }
      };
      const config = new Config({ foo });
      function report({ code, position, meta }) {
        expect(code).to.equal("INLINE_04", "Issue with code `INLINE_03` is reported");
        expect(position)
          .to
          .deep
          .equal({
            start: {
              line: 1,
              column: 1
            },
            end: {
              line: 1,
              column: 38
            }
          });
        expect(meta).to.deep.equal({ data: { rule_name: "foo", error: "not valid" } });
        done();
      }
      const comment = parse("<!-- linthtml-configure foo='bar' -->")[0];
      extract_inline_config(comment, config, report);
    });
  });
});

describe("inline_config with linter", function() {
  it("errors from inline config are returned by the linter", async function() {
    const linter = linthtml.fromConfig({ rules: {} });
    const html = "<!-- linthtml-configure foo=false -->";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
    expect(issues[0]).to.have.property("code", "INLINE_02");
  });

  it("inline config override linter config", async function() {
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

  it("inline config only affect sibling and child nodes", async function() {
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
    expect(issues).to.have.lengthOf(1, "One error is reported as inline_config as root not is not affected by inline_config");
  });

  it("inline config affect siblings after declaration", async function() {
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

  it("inline_config only affect rules that are activated at the linter creatinon", async function() {
    const linter = linthtml.fromConfig({
      rules: {}
    });

    const html = `
      <!-- linthtml-configure attr-bans=["align"] -->
      <div align></div>
    `;
    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0, "No errors are reported as attr-bans was not configured when linter was created");
  });

  it("inline_config can deactivate/activate rules", async function() {
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
});
