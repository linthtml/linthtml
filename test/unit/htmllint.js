const linthtml = require("../../");
const { expect } = require("chai");

describe("linthtml", function() {
  it("should be a function", function() {
    expect(linthtml).to.be.an.instanceOf(Function);
  });

  it("should return a thenable", function() {
    var thenable = linthtml("");

    expect(thenable).to.have.property("then");
  });

  it("should eventually return an array", function() {
    var result = linthtml("");

    return result.then(function(output) {
      expect(output).to.be.an.instanceOf(Array);
    });
  });

  it("should not throw on sanity.html", function() {
    var fs = require("fs");
    var filePath = "./test/fixtures/sanity.html",
      sanityHtml = fs.readFileSync(filePath, { encoding: "utf8" });

    expect(function() {
      linthtml(sanityHtml);
    }).to.not.throw(Error);
  });

  describe("use", function() {
    it("should register a plugin on the defaultLinter", function() {
      var rule = {
          name: "testrule"
        },
        plugins = ["chai", { rules: [rule] }];

      linthtml.use(plugins);

      expect(linthtml.defaultLinter.rules.getRule(rule.name)).to.be.eql(rule);
    });
  });
});
