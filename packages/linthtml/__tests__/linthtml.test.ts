// TODO: Remove .default after typescript migration
import linthtml from "../lib";
import { expect } from "chai";
import path from "path";
import fs from "fs";

describe("linthtml", function () {
  it("should be a function", function () {
    expect(linthtml).to.be.an.instanceOf(Function);
  });

  it("should return a thenable", function () {
    const thenable = linthtml("", {});

    expect(thenable).to.have.property("then");
  });

  it("should eventually return an array", async function () {
    const result = await linthtml("", {});

    expect(result).to.be.an.instanceOf(Array);
  });

  it("should not throw on sanity.html", function () {
    const filePath = path.join(__dirname, "fixtures", "sanity.html");
    const sanityHtml = fs.readFileSync(filePath, { encoding: "utf8" });

    expect(function () {
      linthtml(sanityHtml, {});
    }).to.not.throw(Error);
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
