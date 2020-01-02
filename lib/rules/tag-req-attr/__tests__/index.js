const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("tag-req-attr", function() {
  it("Should not report any error when config is an empty object", async function() {
    const linter = createLinter();
    const html = "<img />";

    const issues = await linter.lint(html, none, { "tag-req-attr": {} });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error when tag contain mandatory attributes", async function() {
    const linter = createLinter();
    const html = "<img src=\"nyan.mrw\" alt=\"nyan\" />";

    const issues = await linter.lint(html, none, { "tag-req-attr": { img: [{ name: "src" }, { name: "alt" }] } });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should an report an error per missing attributes", async function() {
    const linter = createLinter();
    const html = "<img/>";

    const issues = await linter.lint(html, none, { "tag-req-attr": { img: [{ name: "src" }, { name: "alt" }] } });
    expect(issues).to.have.lengthOf(2);
  });

  it("Mandatory attributes should not be empty by default", async function() {
    const linter = createLinter();
    const html = "<input required />";

    const issues = await linter.lint(html, none, { "tag-req-attr": { input: [{ name: "required" }] } });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report an error for empty attribute when \"allowEmpty\" is specified", async function() {
    const linter = createLinter();
    const html = "<input required />";

    const issues = await linter.lint(html, none, { "tag-req-attr": { input: [{ name: "required", allowEmpty: true }] } });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error when there's no configuration for the tag", async function() {
    const linter = createLinter();
    const html = "<img />";

    const issues = await linter.lint(html, none, { "tag-req-attr": { input: [{ name: "required", allowEmpty: true }] } });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should throw an error for an invalid config", function() {
    const linter = createLinter();
    const html = "";
    expect(() => linter.lint(html, none, { "tag-req-attr": "foo" }))
      .to
      .throw("Configuration for rule \"tag-req-attr\" is invalid: Expected object got string");
  });
});

// module.exports = [
//   {
//     desc: "should pass when there is no configuration for the tag",
//     input: '<img src="nyan.mrw" alt="" />',
//     opts: {
//       "tag-req-attr": {
//         input: [
//           {
//             name: "type"
//           }
//         ]
//       }
//     },
//     output: 0
//   }
// ];
