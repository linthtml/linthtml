import { expect } from "chai";
import linthtml from "../index.js";

describe("linthtml.rules", function () {
  linthtml.rules.forEach(function (rule) {
    describe(rule.name, function () {
      it("should have a name", function () {
        expect(rule).to.have.property("name");
      });

      if (rule.name === "free-options") {
        return;
      }

      it("should have a lint function", function () {
        expect(rule).to.have.property("lint");
      });

      if (["dom"].indexOf(rule.name) === -1) {
        it("should subscribe to something", function () {
          expect(rule).to.have.property("on");
          // @ts-expect-error Cannot be null because of previous assertion
          expect(rule.on.length > 0).to.equal(true);
        });
      }
    });
  });
});
