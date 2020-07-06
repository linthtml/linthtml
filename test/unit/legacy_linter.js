const { expect } = require("chai");
const Linter = require("../../lib/legacy/linter");

describe("LegacyLinter", function() {
  let linter = null;

  it("should be a function", function() {
    expect(Linter).to.be.an.instanceOf(Function);
  });

  beforeEach(function() {
    linter = new Linter([
      {
        name: "dom",
        lint: function() {
          return [];
        }
      },
      require("../../lib/rules/free-options.js")
    ]);
  });

  describe("lint", function() {
    const ConstRule = require("../fixtures/const_rule");

    const rule = new ConstRule([
      {
        msg: "this is a test",
        index: 4,
        line: 2,
        column: 3
      },
      {
        msg: "this is a test",
        index: 2
      }
    ]);

    it("Should throw an error when given a nonexistent option", function() {
      expect(() => linter.lint("f\nfff", { nonopt: 7 }, "nodefault"))
        .to
        .throw("Rule \"nonopt\" does not exist");
    });

    it("should return correct line and column numbers", async function() {
      linter.rules.addRule(rule);
      const issues = await linter.lint("f\nfff", "nodefault");
      expect(issues[0].line).to.be.eql(2);
      expect(issues[0].column).to.be.eql(3);
    });

    it("should not truncate output if maxerr is false", async function() {
      linter.rules.addRule(rule);
      const issues = await linter.lint("f\nfff", { maxerr: false }, "nodefault");
      expect(issues).to.have.length(2);
    });

    it("should not return more than the limit fixed by maxerr", async function() {
      linter.rules.addRule(rule);
      const issues = await linter.lint("f\nfff", { maxerr: 1 }, "nodefault");
      expect(issues).to.have.length(1);
    });

    it("Should throw an error for non-integer config for maxerr", function() {
      expect(() => linter.lint("", { maxerr: "five" }, "nodefault"))
        .to
        .throw("Configuration for rule \"maxerr\" is invalid: Expected number got string");
    });
  });

  describe("resetRules", function() {
    it("should return an array of issues", function() {
      const issue = { msg: "hit" };

      linter.rules.addRule({
        end: function() {
          return issue;
        }
      });

      const output = linter.resetRules();

      expect(output[0]).to.be.eql(issue);
    });
  });
});
