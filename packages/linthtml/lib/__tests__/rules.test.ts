import linthtml from "../index";

describe("linthtml.rules", () => {
  // TODO: Remove .default after typescript migration
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

      if (["dom"].indexOf(rule.name) === -1) {
        it("should subscribe to something", () => {
          expect(rule).toHaveProperty("on");
          expect(rule.on.length > 0).toBe(true);
        });
      }
    });
  });
});
