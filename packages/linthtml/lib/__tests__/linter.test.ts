import { expect } from "chai";
import Linter from "../linter.js";
import Config from "../config.js";
// import rewiremock from "rewiremock";
// import path from "path";
import { LegacyRuleDefinition, RuleConfig, RuleDefinition } from "../read-config.js";

const foo: RuleDefinition = {
  name: "foo",
  lint(_node: unknown, _option: unknown, { report }) {
    return report({
      code: "CUSTOM",
      position: {
        start: {
          line: 0,
          column: 0
        },
        end: {
          line: 0,
          column: 0
        }
      }
    });
  }
};

describe("Config", function () {
  it('Should report an issue with the "error" severity', async function () {
    const rule_config: Record<string, RuleConfig> = {
      foo: "error"
    };
    const linter = new Linter({});
    linter.config = new Config([foo as LegacyRuleDefinition], {
      rules: rule_config
    });
    const issues = await linter.lint("<div></div>");
    expect(issues[0].severity).to.equal("error");
  });
  it('Should report an issue with the "warning" severity', async function () {
    const rule_config: Record<string, RuleConfig> = {
      foo: "warning"
    };
    const linter = new Linter({});
    linter.config = new Config([foo as LegacyRuleDefinition], {
      rules: rule_config
    });

    const issues = await linter.lint("<div></div>");
    expect(issues[0].severity).to.equal("warning");
  });

  // it("A custom parser can be provided", async function (done) {
  //   const config_path = path.join(__dirname, "fixtures", "custom-parser.js");
  //   rewiremock.overrideEntryPoint(module);
  //   rewiremock(config_path).with(function (html: string) {
  //     expect(html).to.equal("foo");
  //     rewiremock.disable();
  //     done();
  //     return [];
  //   });
  //   rewiremock.enable();
  //   const linter = new Linter({
  //     parser: config_path
  //   });
  //   linter.lint("foo");
  // });
  it("should report an error when provided with an unexisting parser", async function () {
    try {
      // eslint-disable-next-line no-new
      new Linter({
        parser: "foo"
      });
    } catch (error: unknown) {
      expect(error).to.be.a("CustomError").to.have.property("code", "CORE-04");
      // @ts-expect-error system error
      expect(error.meta).to.deep.equal({
        module_name: "foo"
      });
    }
  });
});
