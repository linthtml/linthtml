import Linter from "../linter";
// import Config from "../config";
// import rewiremock from "rewiremock/node";
import path from "path";
// import { LegacyRuleDefinition, RuleConfig, RuleDefinition } from "../read-config";
// import CustomError from "../utils/custom-errors";

// const foo: RuleDefinition = {
//   name: "foo",
//   lint(_node: unknown, _option: unknown, { report }) {
//     return report({
//       code: "CUSTOM",
//       position: {
//         start: {
//           line: 0,
//           column: 0
//         },
//         end: {
//           line: 0,
//           column: 0
//         }
//       }
//     });
//   }
// };

describe("Config", () => {
  // it('Should report an issue with the "error" severity', async () => {
  //   const rule_config: Record<string, RuleConfig> = {
  //     foo: "error"
  //   };
  //   const linter = new Linter({});
  //   linter.config = new Config([foo as LegacyRuleDefinition], {
  //     rules: rule_config
  //   });
  //   const issues = await linter.lint("<div></div>");
  //   expect(issues[0].severity).toBe("error");
  // });

  // it('Should report an issue with the "warning" severity', async () => {
  //   const rule_config: Record<string, RuleConfig> = {
  //     foo: "warning"
  //   };
  //   const linter = new Linter({});
  //   linter.config = new Config([foo as LegacyRuleDefinition], {
  //     rules: rule_config
  //   });

  //   const issues = await linter.lint("<div></div>");
  //   expect(issues[0].severity).toBe("warning");
  // });

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

  // it("should report an error when provided with an unexisting parser", () => {
  //   try {
  //     // eslint-disable-next-line no-new
  //     new Linter({
  //       parser: "foo"
  //     });
  //   } catch (error: unknown) {
  //     expect(error).toBeInstanceOf(CustomError);
  //     expect(error).toHaveProperty("code", "CORE-04");
  //     // @ts-expect-error system error
  //     expect(error.meta).toEqual({
  //       module_name: "foo"
  //     });
  //   }
  // });
});
