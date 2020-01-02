const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("label-req-for", function() {
  it("Should not report any error when label has for value matching an existing input id", async function() {
    const linter = createLinter();
    const html = `
      <label for="foo">Foo</label>
      <input type="radio" id="foo">
    `;

    const issues = await linter.lint(html, none, { "label-req-for": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when label has for value not matching an existing input id", async function() {
    const linter = createLinter();
    const html = `
      <label for="foo">Foo</label>
      <input type="radio" id="bar">
    `;

    const issues = await linter.lint(html, none, { "label-req-for": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should be able to deal with multiple label/input", async function() {
    const linter = createLinter();
    const html = `
      <label for="foo">Foo</label>
      <input type="text" id="foo"/>
      <label for="bar">Bar</label>
      <input type="text" id="bar"/>
    `;

    const issues = await linter.lint(html, none, { "label-req-for": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error event when label+input are not siblings", async function() {
    const linter = createLinter();
    const html = `
    <input type="text" id="bar"/>
      <label for="foo">Foo</label>
      <label for="bar">Bar</label>
      <input type="text" id="foo"/>
    `;

    const issues = await linter.lint(html, none, { "label-req-for": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should not report any error when label without for has a input has child node", async function() {
    const linter = createLinter();
    const html = `
      <label for="foo">
        Foo
        <div>
          <input type="text" id="foo"/>
        </div>
      </label>
    `;

    const issues = await linter.lint(html, none, { "label-req-for": true });
    expect(issues).to.have.lengthOf(0);
  });

  it("Should report an error when label without for doesnt't have any labelable node has child", async function() {
    const linter = createLinter();
    const html = `
      <label for="foo">
        Foo
        <div>
          Bar
        </div>
      </label>
    `;

    const issues = await linter.lint(html, none, { "label-req-for": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Should report an error when label has for value matching an none labelable node", async function() {
    const linter = createLinter();
    const html = `
      <label for="foo">Foo</label>
      <p id="foo">Text content</p>
    `;

    const issues = await linter.lint(html, none, { "label-req-for": true });
    expect(issues).to.have.lengthOf(1);
  });
});
