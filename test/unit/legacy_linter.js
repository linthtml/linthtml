const { expect } = require("chai");
const Linter = require("../../lib/legacy/linter");
describe("LegacyLinter", function() {
  function createLinter() {
    const dom = {
      name: "dom",
      lint: function() {
        return [];
      }
    };
    return new Linter([
      dom,
      require("../../lib/rules/free-options.js")
    ],
    ...arguments
    );
  }

  it("should be a function", function() {
    expect(Linter).to.be.an.instanceOf(Function);
  });

  describe("lint", function() {
    const ConstRule = require("../fixtures/const_rule");

    const rule = new ConstRule([{
      msg: "this is a test",
      index: 4,
      line: 2,
      column: 3
    }, {
      msg: "this is a test",
      index: 2
    }]);

    it("Should throw an error when given a nonexistent option", function() {
      expect(() => (createLinter(null, { nonopt: 7 })).lint("f\nfff"))
        .to
        .throw("Rule \"nonopt\" does not exist");
    });

    it("should return correct line and column numbers", async function() {
      const linter = createLinter();
      linter.rules.addRule(rule);
      const issues = await linter.lint("f\nfff");
      expect(issues[0].line).to.be.eql(2);
      expect(issues[0].column).to.be.eql(3);
    });

    it("should not truncate output if maxerr is false", async function() {
      const linter = createLinter({ maxerr: false });
      linter.rules.addRule(rule);
      const issues = await linter.lint("f\nfff");
      expect(issues).to.have.length(2);
    });

    it("should not return more than the limit fixed by maxerr", async function() {
      const linter = createLinter({ maxerr: 1 });
      linter.rules.addRule(rule);
      const issues = await linter.lint("f\nfff");
      expect(issues).to.have.length(1);
    });

    it("Should throw an error for non-integer config for maxerr", function() {
      expect(() => (createLinter({ maxerr: "five" })).lint(""))
        .to
        .throw("Configuration for rule \"maxerr\" is invalid: Expected number got string");
    });
  });

  describe("resetRules", function() {
    it("should return an array of issues", function() {
      const issue = { msg: "hit" };
      const linter = createLinter();
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
