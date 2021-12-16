const { expect } = require("chai");
// TODO: Remove .default after typescript migration
const Linter = require("../lib/linter").default;
// TODO: Remove .default after typescript migration
const Config = require("../lib/config").default;
const rewiremock = require("rewiremock/node");
const path = require("path");

const foo = {
  name: "foo",
  lint(node, options, { report }) {
    return report({
      code: "CUSTOM",
      position: {
        line: 0,
        column: 0
      }
    });
  }
};

describe("Config", function() {
  it("Should report an issue with the \"error\" severity", async function() {
    const rule_config = {
      foo: "error"
    };
    const linter = new Linter();
    linter.config = new Config([foo], { rules: rule_config });
    const issues = await linter.lint("<div></div>");
    expect(issues[0].severity).to.equal("error");
  });
  it("Should report an issue with the \"warning\" severity", async function() {
    const rule_config = {
      foo: "warning"
    };
    const linter = new Linter();
    linter.config = new Config([foo], { rules: rule_config });

    const issues = await linter.lint("<div></div>");
    expect(issues[0].severity).to.equal("warning");
  });

  it("A custom parser can be provided", async function(done) {
    const config_path = path.join(__dirname, "fixtures", "custom-parser.js");
    rewiremock.overrideEntryPoint(module);
    rewiremock(config_path).with(function(html) {
      expect(html).to.equal("foo");
      rewiremock.disable();
      done();
      return [];
    });
    rewiremock.enable();
    const linter = new Linter({
      parser: config_path
    });
    linter.lint("foo");
  });
  it("should report an error when provided with an unexisting parser", async function() {
    try {
      // eslint-disable-next-line no-new
      new Linter({
        parser: "foo"
      });
    } catch (error) {
      expect(error)
        .to.be.a("CustomError")
        .to.have.property("code", "CORE-04");
      expect(error.meta)
        .to.deep.equal({
          module_name: "foo"
        });
    }
  });
});
