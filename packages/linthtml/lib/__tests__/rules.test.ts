import linthtml from "../index";

describe("linthtml.rules", () => {
  linthtml.rules.forEach(function (rule) {
    describe(rule.name, () => {
      it("should have a name", () => {
        expect(rule).toHaveProperty("name");
      });

      if (rule.name === "free-options") {
        return;
      }

      it("should have a lint function", () => {
        expect(rule).toHaveProperty("lint");
      });
    });
  });
});
