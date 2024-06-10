import { expect } from "chai";
import Linter from "../linter.js";
import Config from "../config.js";
import path from "path";
import type { LegacyRuleDefinition, RuleConfig, RuleDefinition } from "../read-config.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Was not able to make rewiremock work here
  it("A custom parser can be provided", async function () {
    const config_path = path.join(__dirname, "fixtures", "custom-parser.cjs");

    const linter = new Linter({
      parser: config_path
    });
    try {
      await linter.lint("foo");
    } catch (error) {
      expect((error as Error).toString()).to.equal('Error: Custom parser used for "foo"');
    }
  });

  it("should report an error when provided with an unexisting parser", function () {
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

  it("should report a issue of type warning for rules flagged as deprecated", async function () {
    const rule_config: Record<string, RuleConfig> = {
      foo: "error"
    };
    const linter = new Linter({});
    linter.config = new Config([{ ...foo, deprecated: true } as LegacyRuleDefinition], {
      rules: rule_config
    });

    const issues = await linter.lint("<div></div>");
    expect(issues[0].severity).to.equal("warning");
    expect(issues[0].code).to.equal("DEPRECATED_RULE");
  });
});
