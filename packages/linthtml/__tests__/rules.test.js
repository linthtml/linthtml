const { expect } = require("chai");

describe("linthtml.rules", function() {
  // TODO: Remove .default after typescript migration
  const { rules } = require("../lib").default;
  rules.forEach(function(rule) {
    describe(rule.name, function() {
      it("should have a name", function() {
        expect(rule).to.have.property("name");
      });

      if (rule.name === "free-options") {
        return;
      }

      it("should have a lint function", function() {
        expect(rule).to.have.property("lint");
      });

      if (["dom"].indexOf(rule.name) === -1) {
        it("should subscribe to something", function() {
          expect(rule).to.have.property("on");
          expect(rule.on.length > 0).to.equal(true);
        });
      }
    });
  });
});
