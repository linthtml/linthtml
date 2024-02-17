import Linter from "../linter";
import Config from "../config";
import path from "path";
import { LegacyRuleDefinition, RuleConfig, RuleDefinition } from "../read-config";
import CustomError from "../utils/custom-errors";

class NoErrorThrownError extends Error {}

function getError<TError>(fn: () => unknown): TError {
  try {
    fn();
    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
}

const foo = {
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
} satisfies RuleDefinition;

describe("Config", () => {
  it('Should report an issue with the "error" severity', async () => {
    const rule_config = {
      foo: "error"
    } satisfies Record<string, RuleConfig>;
    const linter = new Linter({});
    linter.config = new Config([foo as LegacyRuleDefinition], {
      rules: rule_config
    });
    const issues = await linter.lint("<div></div>");
    expect(issues[0].severity).toBe("error");
  });

  it('Should report an issue with the "warning" severity', async () => {
    const rule_config = {
      foo: "warning"
    } satisfies Record<string, RuleConfig>;
    const linter = new Linter({});
    linter.config = new Config([foo as LegacyRuleDefinition], {
      rules: rule_config
    });

    const issues = await linter.lint("<div></div>");
    expect(issues[0].severity).toBe("warning");
  });

  it("A custom parser can be provided", async () => {
    const config_path = path.join(__dirname, "fixtures", "custom-parser.js");
    const mockParser = jest.fn(() => {
      return {
        parent: null,
        children: []
      };
    });
    jest.mock(path.join(__dirname, "fixtures", "custom-parser.js"), () => {
      return mockParser;
    });

    const linter = new Linter({
      parser: config_path
    });
    await linter.lint("foo");
    expect(mockParser).toHaveBeenCalledWith("foo");
  });

  it("should report an error when provided with an non-existent parser", () => {
    // eslint-disable-next-line no-new
    const error = getError(
      () =>
        new Linter({
          parser: "foo"
        })
    );
    expect(error).toBeInstanceOf(CustomError);
    expect(error).toHaveProperty("code", "CORE-04");
    // @ts-expect-error system error
    expect(error.meta).toEqual({
      module_name: "foo"
    });
  });
});
