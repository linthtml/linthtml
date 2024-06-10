import { expect } from "chai";
import Linter from "../legacy/linter.js";
import ConstRule from "./fixtures/const_rule.js";
import FreeOptionsRule from "../rules/free-options.js";
import type { LegacyLinterConfig, LegacyRuleDefinition } from "../read-config.js";

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
        // @ts-expect-error Free option rules are weird legacy
        FreeOptionsRule
      ],
      ...config
    );
  }

  it("should be a function", function () {
    expect(Linter).to.be.an.instanceOf(Function);
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
      expect(() => createLinter({ nonopt: 7 }).lint("f\nfff")).to.throw('Rule "nonopt" does not exist');
    });

    it("should return correct line and column numbers", async function () {
      const linter = createLinter();
      linter.rules.addRule(rule);
      const issues = await linter.lint("f\nfff");
      expect(issues[0].position?.start.line).to.be.eql(2);
      expect(issues[0].position?.start.column).to.be.eql(3);
    });

    it("should not truncate output if maxerr is not provided", async function () {
      const linter = createLinter();
      linter.rules.addRule(rule);
      const issues = await linter.lint("f\nfff");
      expect(issues).to.have.length(2);
    });

    it("should not return more than the limit fixed by maxerr", async function () {
      const linter = createLinter({ maxerr: 1 });
      linter.rules.addRule(rule);
      const issues = await linter.lint("f\nfff");
      expect(issues).to.have.length(1);
    });

    it("Should throw an error for non-integer config for maxerr", function () {
      // @ts-expect-error Test that config validation throw error is maxerr is not valid
      expect(() => createLinter({ maxerr: "five" }).lint("")).to.throw(
        'Configuration for rule "maxerr" is invalid: Expected number got string'
      );
    });
  });

  describe("resetRules", function () {
    it("should return an array of issues", function () {
      const issue = { msg: "hit" };
      const linter = createLinter();
      linter.rules.addRule({
        // @ts-expect-error Weird legacy
        end() {
          return issue;
        }
      });

      const output = linter.resetRules();

      expect(output[0]).to.be.eql(issue);
    });
  });
});
