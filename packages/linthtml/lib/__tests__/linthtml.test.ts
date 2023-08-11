// TODO: Remove .default after typescript migration
import linthtml from "../index";
import path from "path";
import fs from "fs";

describe("linthtml", () => {
  it("should be a function", () => {
    expect(linthtml).toBeInstanceOf(Function);
  });

  it("should return a thenable", () => {
    const thenable = linthtml("", {});

    expect(thenable).toHaveProperty("then");
  });

  it("should eventually return an array", async () => {
    const result = await linthtml("", {});

    expect(result).toBeInstanceOf(Array);
  });

  it("should not throw on sanity.html", () => {
    const filePath = path.join(__dirname, "fixtures", "sanity.html");
    const sanityHtml = fs.readFileSync(filePath, { encoding: "utf8" });

    expect(function () {
      linthtml(sanityHtml, {});
    }).not.toThrow(Error);
  });

  // describe("use", function() {
  //   it("should register a plugin on the defaultLinter", function() {
  //     var rule = {
  //         name: "testrule"
  //       },
  //       plugins = ["chai", { rules: [rule] }];

  //     linthtml.use(plugins);

  //     expect(linthtml.defaultLinter.rules.getRule(rule.name)).to.be.eql(rule);
  //   });
  // });
});
