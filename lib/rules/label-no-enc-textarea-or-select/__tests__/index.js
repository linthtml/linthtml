const { expect } = require("chai");
const linthtml = require("../../../index");
const none = require("../../../presets").presets.none;

function createLinter() {
  return new linthtml.LegacyLinter(linthtml.rules);
}
describe("label-no-enc-textarea-or-select", function() {
  it("Report an error when there's a <select> inside a <label>", async function() {
    const linter = createLinter();
    const html = `
    <label>
      <select>
        <option value="v1">V1</option>
        <option value="v2">V2</option>
        <option value="v3">V3</option>
      </select>
    </label>
    `;

    const issues = await linter.lint(html, none, { "label-no-enc-textarea-or-select": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Report an error when there's a <textarea> inside a <label>", async function() {
    const linter = createLinter();
    const html = `
    <label>
      <textarea></textarea>
    </label>
    `;

    const issues = await linter.lint(html, none, { "label-no-enc-textarea-or-select": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Report an error when there's a <select> inside a <label> (deep nesting)", async function() {
    const linter = createLinter();
    const html = `
    <label>
      <div>
        <div>
          <select>
            <option value="v1">V1</option>
            <option value="v2">V2</option>
            <option value="v3">V3</option>
          </select>
        </div>
      </div>
    </label>
    `;

    const issues = await linter.lint(html, none, { "label-no-enc-textarea-or-select": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Report an error when there's a <textarea> inside a <label> (deep nesting)", async function() {
    const linter = createLinter();
    const html = `
    <label>
      <div>
        <div>
          <textarea></textarea>
        </div>
      </div>
    </label>
    `;

    const issues = await linter.lint(html, none, { "label-no-enc-textarea-or-select": true });
    expect(issues).to.have.lengthOf(1);
  });

  it("Report nothing when the <select> or the <textarea> in not inside the <label>", async function() {
    const linter = createLinter();
    const html = `
    <label>foo</label>
    <select>
      <option value="bar">bar</option>
    </select>
    <label>Fiz</label>
    <textarea></textarea>
    `;

    const issues = await linter.lint(html, none, { "label-no-enc-textarea-or-select": true });
    expect(issues).to.have.lengthOf(0);
  });
});
