var knife = require("../../lib/knife");
const { expect } = require("chai");

describe("linter", function() {
  var Linter = require("../../lib/linter");
  var linter = null;

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
      {
        name: "line",
        lint: function() {
          return [];
        }
      },
      require("../../lib/rules/free-options.js")
    ]);
  });

  describe("lint", function() {
    var ConstRule = require("../fixtures/const_rule");

    var rule = new ConstRule([
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
        .throw(`Rule "nonopt" does not exist`);
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
        .throw('Configuration for rule "maxerr" is invalid: Expected number got string');
    });
  });

  describe("resetRules", function() {
    it("should return an array of issues", function() {
      var issue = { msg: "hit" };

      linter.rules.addRule({
        end: function() {
          return issue;
        }
      });

      var output = linter.resetRules();

      expect(output[0]).to.be.eql(issue);
    });
  });

  // TODO: move these out of this file...
  describe("shred", function() {
    it("should return an array", function() {
      var output = knife.shred("");
      expect(output).to.be.an.instanceOf(Array);
    });

    it("should return the proper number of lines", function() {
      const lines = [
        "Line1",
        "Line2",
        "Line3"
      ].join("\n");
      const output = knife.shred(lines);

      expect(output.length).to.be.eql(3);
      expect(output[0].text).to.equal('Line1\n');
      expect(output[1].text).to.equal('Line2\n');
      expect(output[2].text).to.equal('Line3');
    });
  });
});
