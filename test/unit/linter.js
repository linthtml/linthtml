const { expect } = require("chai");
const Linter = require("../../lib/linter");
const Config = require("../../lib/config");

describe("Config", function () {
  this.beforeEach(function () {
    const foo = {
      name: "foo",
      lint (node, options, { report }) {
        return report({
          code: "CUSTOM",
          position: [0, 0]
        });
      }
    };
    this.config = new Config({ foo });
    this.rule = this.config.getRule("foo");
  });

  it("Should report an issue with the \"error\" severity", async function () {
    const rule_config = {
      foo: "error"
    };
    this.config.setRuleConfig(this.rule, rule_config);
    const linter = new Linter();
    linter.config = this.config;

    const issues = await linter.lint("<div></div>");
    expect(issues[0].severity).to.equal("error");
  });
  it("Should report an issue with the \"warning\" severity", async function () {
    const rule_config = {
      foo: "warning"
    };
    this.config.setRuleConfig(this.rule, rule_config);
    const linter = new Linter();
    linter.config = this.config;

    const issues = await linter.lint("<div></div>");
    expect(issues[0].severity).to.equal("warning");
  });
});
