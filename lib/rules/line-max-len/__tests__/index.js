const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("line-max-len", function() {
  it("Should not report any error when the line does not exceed the max length", async function() {
    const linter = createLinter();
    const html = "1234";

    const issues = await linter.lint(html, none, { "line-max-len": 5 });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error when the line length equal the max length", async function() {
    const linter = createLinter();
    const html = "12345";

    const issues = await linter.lint(html, none, { "line-max-len": 5 });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should support multilines", async function() {
    const linter = createLinter();
    const html = "12345\n12345\n1234";

    const issues = await linter.lint(html, none, { "line-max-len": 5 });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when the line does exceed the max length", async function() {
    const linter = createLinter();
    const html = "123456";

    const issues = await linter.lint(html, none, { "line-max-len": 5 });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should throw an error if not given a number as config", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "line-max-len": "foo" }))
      .to
      .throw("Configuration for rule \"line-max-len\" is invalid: Expected number got string");
  });

  it("Should throw an error if not given a positive number as config", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "line-max-len": -1 }))
      .to
      .throw("Configuration for rule \"line-max-len\" is invalid: Only positive indent value are allowed.");
  });
});

// module.exports = [
//   {
//     desc: "should pass when line length matches ignore-regex",
//     input: '<a href="http://www.google.com">12345</a>',
//     opts: { "line-max-len": 5, "line-max-len-ignore-regex": "href" },
//     output: 0
//   }
// ];
