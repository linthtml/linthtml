import Linter from "../legacy/linter";
import ConstRule from "./fixtures/const_rule";
import FreeOptionsRule from "../rules/free-options";
import type { LegacyLinterConfig, LegacyRuleDefinition } from "../read-config";

describe("LegacyLinter", function () {
  function createLinter(...config: LegacyLinterConfig[]) {
    const dom = {
      name: "dom",
      lint: function () {
        return [];
      },
      options: [],
      subscribers: [],
      on: ""
    } satisfies LegacyRuleDefinition;
    return new Linter(
      [
        dom,
        // @ts-ignore
        FreeOptionsRule
      ],
      ...config
    );
  }

  it("should be a function", function () {
    expect(Linter).toBeInstanceOf(Function);
  });

  describe("lint", function () {
    const rule = new ConstRule([
      {
        msg: "this is a test",
        index: 4,
        position: {
          start: {
            line: 2,
            column: 3
          }
        }
      },
      {
        msg: "this is a test",
        index: 2
      }
    ]);

    it("Should throw an error when given a nonexistent option", function () {
      expect(() => createLinter({ nonopt: 7 }).lint("f\nfff")).toThrow('Rule "nonopt" does not exist');
    });

    it("should return correct line and column numbers", async function () {
      const linter = createLinter();
      linter.rules.addRule(rule);
      const issues = await linter.lint("f\nfff");
      expect(issues[0].position.start.line).toEqual(2);
      expect(issues[0].position.start.column).toEqual(3);
    });

    it("should not truncate output if maxerr is not provided", async function () {
      const linter = createLinter();
      linter.rules.addRule(rule);
      const issues = await linter.lint("f\nfff");
      expect(issues).toHaveLength(2);
    });

    it("should not return more than the limit fixed by maxerr", async function () {
      const linter = createLinter({ maxerr: 1 });
      linter.rules.addRule(rule);
      const issues = await linter.lint("f\nfff");
      expect(issues).toHaveLength(1);
    });

    it("Should throw an error for non-integer config for maxerr", function () {
      // @ts-expect-error Test that config validation throw error is maxerr is not valid
      expect(() => createLinter({ maxerr: "five" }).lint("")).toThrow(
        'Configuration for rule "maxerr" is invalid: Expected number got string'
      );
    });
  });

  describe("resetRules", function () {
    it("should return an array of issues", function () {
      const issue = { msg: "hit" };
      const linter = createLinter();
      linter.rules.addRule({
        // @ts-ignore
        end() {
          return issue;
        }
      });

      const output = linter.resetRules();

      expect(output[0]).toEqual(issue);
    });
  });
});
