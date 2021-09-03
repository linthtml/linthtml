const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

describe("legacy linter | attr-req-value", function() {
  function createLinter(config) {
    return new linthtml.LegacyLinter(linthtml.rules, none, config);
  }
  it("Should not report an error for attribute with a value", async function() {
    const linter = createLinter({ "attr-req-value": true });
    const html = "<div class=\"foo\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should accept spaces in attributes value", async function() {
    const linter = createLinter({ "attr-req-value": true });
    const html = "<div class=\"foo bar\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when an attribute didn't have a value", async function() {
    const linter = createLinter({ "attr-req-value": true });
    const html = "<div class></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  // It's not an issue. Browsers convert `class= id="bar"` in `class="id=bar"`
  // it("Should report an error when an attribute didn't have a value (with an equal sign)", async function() {
  //   const linter = createLinter();
  //   const html = "<div class= id=\"bar\"></div>";

  //   const issues = await linter.lint(html, { "attr-req-value": true });
  //   expect(issues).to.have.lengthOf(1);
  // });

  // For a browser class and class="" are the same
  it("Should report an error for empty value", async function() {
    const linter = createLinter({ "attr-req-value": true });
    const html = "<div id=\"\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report errors for boolean attributes", async function() {
    const linter = createLinter({ "attr-req-value": true });
    const html = `
      <input type="text" id="input" name="input" required disabled>
      <label for="input">Text input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  // TODO: Add another rule `attribute-no-unnecessary-equal` or something like this
  // `required=` is not invalid it's the same as required or required=""
  // it("Should report errors for boolean attributes with '=' but no values", async function() {
  //   const linter = createLinter();
  //   const html = `
  //     <input type="text" id="input" name="input" disabled required= >
  //     <label for="input">Text input</label>
  //   `;

  //   const issues = await linter.lint(html, { "attr-req-value": true });
  //   expect(issues).to.have.lengthOf(1);
  // });
});

describe("attr-req-value", function() {
  function createLinter(rules) {
    return linthtml.fromConfig({ rules });
  }
  it("Should not report an error for attribute with a value", async function() {
    const linter = createLinter({ "attr-req-value": true });
    const html = "<div class=\"foo\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should accept spaces in attributes value", async function() {
    const linter = createLinter({ "attr-req-value": true });
    const html = "<div class=\"foo bar\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when an attribute didn't have a value", async function() {
    const linter = createLinter({ "attr-req-value": true });
    const html = "<div class></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  // it("Should report an error when an attribute didn't have a value (with an equal sign)", async function() {
  //   const linter = createLinter({ "attr-req-value": true });
  //   const html = "<div class= id=\"bar\"></div>";

  //   const issues = await linter.lint(html);
  //   expect(issues).to.have.lengthOf(1);
  // });

  it("Should report an error for empty value", async function() {
    const linter = createLinter({ "attr-req-value": true });
    const html = "<div id=\"\"></div>";

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(1);
  });

  it("Should not report errors for boolean attributes", async function() {
    const linter = createLinter({ "attr-req-value": true });
    const html = `
      <input type="text" id="input" name="input" required disabled>
      <label for="input">Text input</label>
    `;

    const issues = await linter.lint(html);
    expect(issues).to.have.lengthOf(0);
  });

  // it("Should report errors for boolean attributes with '=' but no values", async function() {
  //   const linter = createLinter({ "attr-req-value": true });
  //   const html = `
  //     <input type="text" id="input" name="input" required= disabled>
  //     <label for="input">Text input</label>
  //   `;

  //   const issues = await linter.lint(html);
  //   expect(issues).to.have.lengthOf(1);
  // });
});
// module.exports = [
// //test htmlparser ?
//     desc: "should handle non-lowercase attribute names",
//     input: '<img SRC="test image.jpg" Alt="test">',
//     opts: { "attr-req-value": true },
//     output: 0
//   },
