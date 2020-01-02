const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("id-no-dup", function() {
  it("Should not report an error when there's no duplicated id", async function() {
    const linter = createLinter();
    const html = "<div id=\"foo\"></div>";

    const issues = await linter.lint(html, none, { "id-no-dup": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report errors when there's duplicated id", async function() {
    const linter = createLinter();
    const html = `
      <div id="foo"></div>
      <div id="foo"></div>
    `;

    const issues = await linter.lint(html, none, { "id-no-dup": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should catch mutliple duplicates id", async function() {
    const linter = createLinter();
    const html = `
      <div id="foo"></div>
      <div id="bar"></div>
      <div id="foo"></div>
      <div id="bar"></div>
    `;

    const issues = await linter.lint(html, none, { "id-no-dup": true });
    expect(issues).to.have.lengthOf(2);
  });

  // TODO: should ignore trailling/leading space ?
  // it("Should catch duplicates id even with leading and trailing whitespaces", async function() {
  //   const linter = createLinter();
  //   const html = `
  //     <div id="foo"></div>
  //     <div id="bar "></div>
  //     <div id=" foo"></div>
  //     <div id="bar"></div>
  //   `;

  //   const issues = await linter.lint(html, none, { "id-no-dup": true });
  //     expect(issues).to.have.lengthOf(2);
  //     done();
  //   });
  // });
});
